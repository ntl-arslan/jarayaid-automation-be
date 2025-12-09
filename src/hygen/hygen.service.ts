import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { In, Repository } from 'typeorm';
import { CountriesInfo } from 'src/county_sources/entities/county_info.entity';
import { ScriptGeneration } from 'src/script-generation/entities/script-generation.entity';
import { Sponsor } from 'src/sponsor/entities/sponsor.entity';
import { SponsorCountry } from 'src/sponsor-countries/entities/sponsor-country.entity';

@Injectable()
export class HeygenService {
  constructor(
    @InjectRepository(CountriesInfo)
    private readonly countriesInfoRepo: Repository<CountriesInfo>,
    @InjectRepository(ScriptGeneration)
    private readonly scriptGenerationRepo: Repository<ScriptGeneration>,
    @InjectRepository(Sponsor)
    private readonly sponsorRepo: Repository<Sponsor>,
  ) {}

  private readonly API_KEY =
    'sk_V2_hgu_kD8CF3X26ne_JG14EVQ4YxiFK8jlDRnCod84gsHvB13u';
  private readonly TEMPLATE_ID = 'ea5bc460f3a8491a8b8a21f626bf50e8';
  private readonly HEADERS = {
    'X-Api-Key': this.API_KEY,
    'Content-Type': 'application/json',
  };
  private readonly DIMENSION = { width: 1280, height: 720 };
  private readonly VOICE_ID = 'YOUR_VOICE_ID';
  private readonly logger = new Logger(HeygenService.name);

  async generateShortNewsVideo(country_id?: number) {
    try {
      // 1. Fetch active countries
      // const countries = await this.countriesInfoRepo
      //   .createQueryBuilder('ci')
      //   .where('ci.status = :status', { status: 'ACTIVE' })
      //   .getMany();

      const query = this.countriesInfoRepo
        .createQueryBuilder('ci')
        .where('ci.status = :status', { status: 'ACTIVE' });

      if (country_id) {
        query.andWhere('ci.country_id = :country_id', { country_id });
      }

      const countries = await query.getMany();

      if (!countries.length) {
        return { status: 'FAILURE', message: 'No active countries found' };
      }

      const finalResults = [];

      for (const country of countries) {
        const countryId = country.id;
        const jarayidCountryId = country.country_id;

        this.logger.log(`Processing country_id: ${countryId}`);

        // 2. Fetch all scripts for this country
        const scripts = await this.scriptGenerationRepo
          .createQueryBuilder('sg')
          .where('sg.status = :status', { status: 'ACTIVE' })
          .andWhere('sg.country_info_id = :cId', { cId: countryId })
          .orderBy('sg.datetime', 'ASC') // order scripts
          .getMany();

        if (!scripts.length) {
          this.logger.warn(`No active scripts for country_id ${countryId}`);
          continue;
        }

        // 3. Fetch all sponsors for this country
        const sponsors = await this.sponsorRepo
          .createQueryBuilder('s')
          .innerJoin(SponsorCountry, 'sc', 'sc.sponsor_id = s.id')
          .where('s.status = :sponsorStatus', { sponsorStatus: 'ACTIVE' })
          .andWhere('sc.status = :scStatus', { scStatus: 'ACTIVE' })
          .andWhere('sc.country_id = :cid', { cid: jarayidCountryId })
          .orderBy('s.id')
          .getMany();

        if (!sponsors.length) {
          this.logger.warn(`No active sponsors for country_id ${countryId}`);
          continue;
        }

        // Use first sponsor for logo (you can change logic if needed)
        const sponsor = sponsors[0];

        // 4. Prepare variables for all scripts
        const variables: any = {};

        variables['sponsor_logo'] = {
          name: 'sponsor_logo',
          type: 'image',
          properties: {
            url:
              sponsor.logo ||
              'https://raw.githubusercontent.com/Furqan-Tariq/Jarayaid-Testing/ccfa219ad19d72faeb2e8242859606e5237c5af2/sponsor_logo.jpeg',
            fit: 'contain',
          },
        };

        // Add all scripts dynamically: script_s1, script_s2, ...
        scripts.forEach((script, index) => {
          const key = `script_s${index + 1}`;
          variables[key] = {
            name: key, // must match variable key
            type: 'text',
            properties: { content: script.prompt || 'No content found' },
          };
        });

        const payload = {
          title: `Jarayaid — Country ${countryId} (${new Date().toLocaleDateString()})`,
          variables,
          dimension: this.DIMENSION,
          voice_id: this.VOICE_ID,
        };

        this.logger.debug(
          `HeyGen Payload for country ${countryId}:`,
          JSON.stringify(payload, null, 2),
        );

        // 5. Submit to HeyGen API
        const genRes = await axios.post(
          `https://api.heygen.com/v2/template/${this.TEMPLATE_ID}/generate`,
          payload,
          { headers: this.HEADERS, timeout: 60000 },
        );

        const videoId = genRes.data.data.video_id;
        this.logger.log(
          `Video submitted for country ${countryId}. VideoID = ${videoId}`,
        );

        // 6. Poll for completion
        const statusUrl = `https://api.heygen.com/v1/video_status.get?video_id=${videoId}`;
        let videoUrl: string = null;

        while (true) {
          const statusRes = await axios.get(statusUrl, {
            headers: this.HEADERS,
            timeout: 30000,
          });

          const data = statusRes.data.data;

          if (data.status === 'completed') {
            videoUrl = data.video_url;
            this.logger.log(
              `Video ready for country ${countryId}: ${videoUrl}`,
            );
            break;
          }

          if (data.status === 'failed') {
            throw new Error(
              `Video generation failed: ${data.error || 'Unknown error'}`,
            );
          }

          await new Promise((r) => setTimeout(r, 5000));
        }

        // const updateScriptRes = await this.scriptGenerationRepo.update(
        //   { id: In(scripts.map(s => s.id)) },
        //   {
        //     status: 'DONE',
        //     video_gen_status: 'DONE',
        //   },
        // );

        finalResults.push({
          country_id: countryId,
          script_count: scripts.length,
          sponsor_id: sponsor.id,
          video_url: videoUrl,
        });
      }

      return { status: 'SUCCESS', results: finalResults };
    } catch (err) {
      this.logger.error(
        'Error generating HeyGen videos',
        err.response?.data || err.message || err,
      );

      return {
        status: 'FAILURE',
        error: err.response?.data || err.message || err,
      };
    }
  }
}
