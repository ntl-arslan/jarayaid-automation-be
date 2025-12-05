import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Repository } from 'typeorm';
import { CountriesInfo } from 'src/county_sources/entities/county_info.entity';
import { CountrySources } from 'src/county_sources/entities/country_source.entity';
import { ScriptGeneration } from 'src/script-generation/entities/script-generation.entity';
import { Sponsor } from 'src/sponsor/entities/sponsor.entity';
import { SponsorCountry } from 'src/sponsor-countries/entities/sponsor-country.entity';

@Injectable()
export class HeygenService {
  constructor(
    @InjectRepository(CountriesInfo)
    private readonly countriesInfoRepo: Repository<CountriesInfo>,
    @InjectRepository(CountrySources)
    private readonly countrySourcesRepo: Repository<CountrySources>,
    @InjectRepository(ScriptGeneration)
    private readonly scriptGenerationRepo: Repository<ScriptGeneration>,
    @InjectRepository(Sponsor)
    private readonly sponsorRepo: Repository<Sponsor>,
    @InjectRepository(SponsorCountry)
    private readonly sponsorCountryRepo: Repository<SponsorCountry>,
  ) {}

  private readonly API_KEY = 'sk_V2_hgu_kD8CF3X26ne_JG14EVQ4YxiFK8jlDRnCod84gsHvB13u';
  private readonly TEMPLATE_ID = 'ea5bc460f3a8491a8b8a21f626bf50e8';
  private readonly HEADERS = { 'X-Api-Key': this.API_KEY, 'Content-Type': 'application/json' };
  private readonly DIMENSION = { width: 1280, height: 720 };
  private readonly VOICE_ID = 'YOUR_ARABIC_VOICE_ID';
  private readonly logger = new Logger(HeygenService.name);

  async generateShortNewsVideo() {
    try {
      // -------------------------
      // 1. Fetch active countries
      // -------------------------
      const countries = await this.countriesInfoRepo
        .createQueryBuilder('ci')
        .where('ci.status = :status', { status: 'ACTIVE' })
        .getMany();

      if (!countries.length) {
        return { status: 'FAILURE', message: 'No active countries found' };
      }
      const countryIds = countries.map(c => c.id);
      const jarayidCountryIds = countries.map(c => c.country_id);
      this.logger.debug('Active country IDs:', countryIds);

      // -------------------------
      // 2. Fetch active country sources
      // -------------------------
      const countrySources = await this.countrySourcesRepo
        .createQueryBuilder('cs')
        .where('cs.status = :csStatus', { csStatus: 'ACTIVE' })
        .andWhere('cs.jarayid_country_id IN (:...ids)', { ids: jarayidCountryIds })
        .getMany();
		

      if (!countrySources.length) {
        this.logger.warn('No active country sources found');
      } else {
       // this.logger.debug('Active country sources:', countrySources);
      }
		
      // -------------------------
      // 3. Fetch active scripts
      // -------------------------
      const scripts = await this.scriptGenerationRepo
        .createQueryBuilder('sg')
        .where('sg.status = :status', { status: 'ACTIVE' })
        .andWhere('sg.country_info_id IN (:...ids)', { ids: countryIds })
        .orderBy('sg.datetime', 'DESC')
        .getMany();

      if (!scripts.length) {
        return { status: 'FAILURE', message: 'No active scripts found' };
      }
		
      const script = scripts[0]; // pick first script
      this.logger.debug('Selected script:', script);

      // -------------------------
      // 4. Fetch sponsors for active countries
      // -------------------------

			console.log(jarayidCountryIds,'countryIds');
      const sponsors = await this.sponsorRepo
        .createQueryBuilder('s')
        .innerJoin(SponsorCountry, 'sc', 'sc.sponsor_id = s.id')
        .where('s.status = :sponsorStatus', { sponsorStatus: 'ACTIVE' })
        .andWhere('sc.status = :scStatus', { scStatus: 'ACTIVE' })
        .andWhere('sc.country_id IN (:...ids)', { ids: jarayidCountryIds })
				.orderBy('s.id')
        .getMany();

      if (!sponsors.length) {
        return { status: 'FAILURE', message: 'No active sponsors found' };
      }
      const sponsor = sponsors[0];
		
      this.logger.debug('Selected sponsor:', sponsor);

      // -------------------------
      // 5. Prepare HeyGen variables
      // -------------------------
      const variables = {
        sponsor_logo: {
          name:"sponsor_logo",
          type: 'image',
          properties: {
           url: sponsor.logo || 'https://raw.githubusercontent.com/Furqan-Tariq/Jarayaid-Testing/ccfa219ad19d72faeb2e8242859606e5237c5af2/sponsor_logo.jpeg',
            fit: 'contain',
          },
        },
    //    script_s1: { name: 'script_s1', type: 'text', properties: { content: script.prompt || 'Default news text' } },
      // script_s2: { name: 'script_s2', type: 'text', properties: { content: countrySources[0]?.source || 'Second scene placeholder' } },
        script_s3: { name: 'script_s3', type: 'text', properties: { content: 'I Love Agile' } },
        // script_s4: { name: 'script_s4', type: 'text', properties: { content: 'Fourth scene placeholder...' } },
        // script_s5: { name: 'script_s5', type: 'text', properties: { content: 'Fifth scene placeholder...' } },
      };

      const payload = {
        title: `Jarayaid — News Video (${new Date().toLocaleDateString()})`,
        variables,
        dimension: this.DIMENSION,
        voice_id: this.VOICE_ID,
      };

      this.logger.debug('HeyGen payload:', JSON.stringify(payload, null, 2));

      // -------------------------
      // 6. Submit to HeyGen API
      // -------------------------
      const genRes = await axios.post(
        `https://api.heygen.com/v2/template/${this.TEMPLATE_ID}/generate`,
        payload,
        { headers: this.HEADERS, timeout: 60000 },
      );

      const videoId = genRes.data.data.video_id;
      this.logger.log(`Video submitted. ID: ${videoId}`);

      // -------------------------
      // 7. Poll for completion
      // -------------------------
      const statusUrl = `https://api.heygen.com/v1/video_status.get?video_id=${videoId}`;
      let videoUrl: string = null;

      while (true) {
        const statusRes = await axios.get(statusUrl, { headers: this.HEADERS, timeout: 30000 });
        const data = statusRes.data.data;

        if (data.status === 'completed') {
          videoUrl = data.video_url;
          this.logger.log(`✅ Video ready: ${videoUrl}`);
          break;
        }

        if (data.status === 'failed') {
          throw new Error(`❌ Video generation failed: ${data.error || 'Unknown error'}`);
        }

        this.logger.log(`⏳ Status: ${data.status}, waiting 5s...`);
        await new Promise(r => setTimeout(r, 5000));
      }

      return { status: 'SUCCESS', videoUrl };
    } catch (err) {
      this.logger.error('Error generating HeyGen news video', err.response?.data || err.message || err);
      return { status: 'FAILURE', message: 'Error generating HeyGen news video', error: err.response?.data || err.message || err };
    }
  }
}
