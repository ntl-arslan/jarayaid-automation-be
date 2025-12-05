import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JoiningWords } from 'src/joining-words/entities/joining-word.entity';
import { ScriptConfiguration } from 'src/script-configuration/entities/script-configuration.entity';
import { ScriptGeneration } from 'src/script-generation/entities/script-generation.entity';
import { CountrySources } from 'src/county_sources/entities/country_source.entity';
import { CountriesInfo } from 'src/county_sources/entities/county_info.entity';
import axios from 'axios';

@Injectable()
export class OpenAIService {
  private openai: OpenAI;
  private maxTokens: number;

  constructor(
    @InjectRepository(JoiningWords)
    private readonly joiningWordsRepo: Repository<JoiningWords>,
    @InjectRepository(ScriptConfiguration)
    private readonly scriptConfigurationRepo: Repository<ScriptConfiguration>,
    @InjectRepository(ScriptGeneration)
    private readonly scriptGenerationRepo: Repository<ScriptGeneration>,
    @InjectRepository(CountrySources)
    private readonly countrySourcesRepo: Repository<CountrySources>,
    @InjectRepository(CountriesInfo)
    private readonly countriesInfoRepo: Repository<CountriesInfo>,
    private readonly configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }

    this.openai = new OpenAI({ apiKey });
    this.maxTokens = 5000;
  }

  async generateScripts(operator: string, model?: string): Promise<any> {
    try {
      // prompt params start
      const countries = await this.countriesInfoRepo.find({
        where: {
          status: 'ACTIVE',
        },
      });

      if (countries?.length === 0) {
        return {
          status: 'FAILURE',
          statusCode: HttpStatus.NOT_FOUND,
          message: 'No active countries found',
          data: [],
        };
      }

      const jarayidCountryIds = countries.map((country) => country?.country_id);

      const sources = await this.countrySourcesRepo
        .createQueryBuilder('cs')
        .leftJoinAndSelect('cs.joiningWord', 'jw')
        .where('cs.status = :STATUSS', { STATUSS: 'ACTIVE' })
        .andWhere('cs.jarayid_country_id IN (:...ids)', {
          ids: jarayidCountryIds,
        })
        .getMany();

      if (sources?.length === 0) {
        return {
          status: 'FAILURE',
          statusCode: HttpStatus.NOT_FOUND,
          message: 'No active sources found',
          data: [],
        };
      }

      // console.log(sources);

      const scriptConfigurations = await this.scriptConfigurationRepo.find({
        where: {
          status: 'ACTIVE',
        },
      });

      const introMessages = scriptConfigurations
        .filter((scriptConfiguration) => scriptConfiguration?.key === 'INTRO')
        .map((scriptConfiguration) => scriptConfiguration.value);

      const outroMessages = scriptConfigurations
        .filter((scriptConfiguration) => scriptConfiguration?.key === 'OUTRO')
        .map((scriptConfiguration) => scriptConfiguration.value);

      const outroSequencNumber = scriptConfigurations.find(
        (scriptConfiguration) => scriptConfiguration?.key === 'OUTRO',
      )?.sequence;

      const customMessages = scriptConfigurations
        .filter(
          (scriptConfiguration) =>
            scriptConfiguration?.key === 'CUSTOM' &&
            scriptConfiguration?.sequence > outroSequencNumber,
        )
        .map((scriptConfiguration) => scriptConfiguration.value);

      const jarayidURL = process.env.JARAYID_BE_URL;
      if (!jarayidURL) {
        throw new Error('Jarayid URL not found');
      }

      const articles = await Promise.all(
        jarayidCountryIds.map(async (jarayidCountryId) => {
          const response = await axios.get(
            `${jarayidURL}/articles/getArticleById/${jarayidCountryId}`,
          );
          return response?.data?.data;
        }),
      );

      const flatArticles = articles.flat();
      // Map sources to articles by SOURCE_ID / jarayid_rss_source_id

      const mappedArray: any[] = [];

      for (const country of countries) {
        let count = 0;

        const countrySources = sources.filter(
          (s) => s.jarayid_country_id === country.id,
        );

        for (const source of countrySources) {
          const matchingArticles = flatArticles.filter(
            (art) => art.SOURCE_ID === source.jarayid_rss_source_id,
          );

          for (const article of matchingArticles) {
            if (count >= 10) break;

            mappedArray.push({
              country_id: country.country_id,
              ...source,
              article_title_arabic: article.ARABIC_TITLE,
              article_summary_arabic: article.articleDetail?.[0]?.ARABICSUMMARY,
              article_link: article.LINK,
            });

            count++;
          }

          if (count >= 10) break;
        }
      }

      const usedIntros: Set<string> = new Set();
      const usedOutros: Set<string> = new Set();

      const countryBuckets: Record<number, any[]> = {};

      for (const item of mappedArray) {
        const intro = this.pickUnique(introMessages, usedIntros);
        const outro = this.pickUnique(outroMessages, usedOutros);
        const custom = this.pickRandom(customMessages);

        const scriptRequest = {
          joining_word: item.joiningWord?.joining_word,
          source_type: item.type,
          source_name: item.source,
          article_title: item.article_title_arabic,
          article_summary: item.article_summary_arabic,
          intro,
          outro,
          custom,
        };

        if (!countryBuckets[item.country_id]) {
          countryBuckets[item.country_id] = [];
        }

        const currentIndex = countryBuckets[item.country_id].length + 1;

        countryBuckets[item.country_id].push({
          key: `script_s${currentIndex}`,
          params: scriptRequest,
        });
      }

      let countriesPrompt = '';

      for (const countryId in countryBuckets) {
        countriesPrompt += `
        [COUNTRY ${countryId}]
        ${countryBuckets[countryId]
          .map(
            (entry) => `
          [${entry.key}]
          Joining Word: ${entry.params.joining_word}
          Source Type: ${entry.params.source_type}
          Source Name: ${entry.params.source_name}
          Article Title (Arabic): ${entry.params.article_title}
          Article Summary (Arabic): ${entry.params.article_summary}
          
          Intro Message: ${entry.params.intro}
          Outro Message: ${entry.params.outro}
          Custom Message: ${entry.params.custom}
        `,
          )
          .join('')}
        `;
      }

      const prompt = `
      You are to generate news bulletin scripts in Arabic for multiple countries.
      
      Return the output STRICTLY as a **valid JSON string**, following this format:
      
      {
        "country_[id]": {
          "script_s1": "....",
          "script_s2": "...."
        },
        "country_[id]": {
          "script_s1": "....",
          "script_s2": "...."
        }
      }
      
      country_[id] should replaced with proper IDs provided below in format [COUNTRY ID]
      
      No extra text, no markdown, no explanations.
      
      Here are the items:
      
      ${countriesPrompt}
      `;

      let scripts = null;
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        attempts++;

        try {
          const completion = await this.openai.chat.completions.create({
            model: model || this.configService.get<string>('OPENAI_MODEL'),
            messages: [{ role: 'user', content: prompt }],
            max_tokens: this.maxTokens,
          });

          const message = completion.choices?.[0]?.message?.content;
          if (!message)
            throw new Error(`Empty OpenAI response (attempt ${attempts})`);

          try {
            scripts = JSON.parse(message);

            if (!this.isValidScriptStructure(scripts)) {
              throw new Error('JSON schema invalid');
            }

            break;
          } catch (jsonError) {
            console.warn(`JSON parse failed on attempt ${attempts}`);

            // 2) Try repair before retrying
            const repaired = await this.attemptJsonRepair(message);

            if (repaired && this.isValidScriptStructure(repaired)) {
              console.log('JSON repaired successfully.');
              scripts = repaired;
              break;
            }

            console.warn('JSON repair failed.');

            if (attempts < maxAttempts) {
              console.log(
                `Retrying full generation after ${attempts * 500}ms...`,
              );
              await this.delay(attempts * 500);
              continue;
            }

            throw new Error(
              'Failed to generate valid JSON after retries and repair attempt',
            );
          }
        } catch (error) {
          console.error(`OpenAI error on attempt ${attempts}:`, error);

          if (attempts < maxAttempts) {
            console.log(`Retrying after ${attempts * 500}ms...`);
            await this.delay(attempts * 500);
            continue;
          } else {
            throw new Error('OpenAI request failed after multiple attempts.');
          }
        }
      }
      
      const scriptsToSave = [];
      
      for (const countryId in scripts) {
        const countryScripts = scripts[countryId];
        const jarayidCountryId = parseInt(countryId.replace("country_", "")); // convert "country_1" → 1
        const countryInfoId = countries.find(country => country?.country_id === jarayidCountryId)?.id;
      
        for (const scriptKey in countryScripts) {
          scriptsToSave.push({
            country_info_id: countryInfoId,
            prompt: JSON.stringify({ [scriptKey]: countryScripts[scriptKey] }), // store as JSON string per script
            status: 'ACTIVE',
            approval_status: 'AUTO',
            video_gen_status: 'PENDING',
            operator: operator
          });
        }
      }
      
      if (scriptsToSave.length > 0) {
        const scriptGenInsert = await this.scriptGenerationRepo.save(scriptsToSave);
      }

      return {
        status: 'SUCCESS',
        statusCode: HttpStatus.OK,
        message: 'Script generated successfuly',
        data: scripts,
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
    }
  }
  pickRandom(arr: string[]) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  pickUnique(arr: string[], usedSet: Set<string>) {
    const available = arr.filter((item) => !usedSet.has(item));
    if (available.length === 0) return this.pickRandom(arr);
    const selected = this.pickRandom(available);
    usedSet.add(selected);
    return selected;
  }

  private async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private isValidScriptStructure(obj: any): boolean {
    if (typeof obj !== 'object' || Array.isArray(obj)) return false;

    for (const countryKey of Object.keys(obj)) {
      if (!/^country_\d+$/.test(countryKey)) return false;

      const scripts = obj[countryKey];
      if (typeof scripts !== 'object' || Array.isArray(scripts)) return false;

      for (const scriptKey of Object.keys(scripts)) {
        if (!/^script_s\d+$/.test(scriptKey)) return false;
        if (typeof scripts[scriptKey] !== 'string') return false;
      }
    }

    return true;
  }

  private async attemptJsonRepair(badJson: string): Promise<any | null> {
    try {
      const repairPrompt = `
      You will receive invalid or partially valid JSON. 
      Your ONLY task is to fix it and output **valid JSON only**. 
      No comments, no markdown, no explanations.
      
      Here is the broken JSON:
      ${badJson}
      `;

      const fixResponse = await this.openai.chat.completions.create({
        model: this.configService.get<string>('OPENAI_MODEL'),
        messages: [{ role: 'user', content: repairPrompt }],
        max_tokens: this.maxTokens,
      });

      const fixed = fixResponse.choices?.[0]?.message?.content;

      if (!fixed) return null;

      return JSON.parse(fixed);
    } catch (e) {
      return null; // Repair failed
    }
  }
}
