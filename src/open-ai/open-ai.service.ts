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

@Injectable()
export class OpenAIService {
  private openai: OpenAI;

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
  }

  /**
   * Generates a script using OpenAI Chat API.
   * @param prompt - The text prompt for AI generation
   * @param model - Optional model override (default from env)
   * @param maxTokens - Optional max tokens (default 500)
   * @returns Generated text
   */
  async generateScript(
    prompt: string,
    model?: string,
    maxTokens = 500,
  ): Promise<any> {
    try {
      // prompt params
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
      const countryIds = countries.map((country) => country?.id);

      const sources = await this.countrySourcesRepo
        .createQueryBuilder('cs')
        .leftJoinAndSelect(JoiningWords, 'jw')
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

      console.log(sources);

      return {
        status: 'FAILURE',
        statusCode: HttpStatus.NOT_FOUND,
        message: 'No active countries found',
        data: [],
      };

      const completion = await this.openai.chat.completions.create({
        model: model || this.configService.get<string>('OPENAI_MODEL'),
        messages: [{ role: 'user', content: prompt }],
        max_tokens: maxTokens,
      });

      // Ensure response exists
      const message = completion.choices?.[0]?.message?.content;
      if (!message) {
        throw new InternalServerErrorException(
          'No content returned from OpenAI',
        );
      }

      return message;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new InternalServerErrorException(
        'Failed to generate script from OpenAI',
      );
    }
  }
}
