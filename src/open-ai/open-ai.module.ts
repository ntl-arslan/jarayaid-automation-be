import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OpenAIService } from './open-ai.service';
import { OpenAIController } from './open-ai.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JoiningWords } from 'src/joining-words/entities/joining-word.entity';
import { ScriptConfiguration } from 'src/script-configuration/entities/script-configuration.entity';
import { ScriptGeneration } from 'src/script-generation/entities/script-generation.entity';
import { CountrySources } from 'src/county_sources/entities/country_source.entity';
import { CountriesInfo } from 'src/county_sources/entities/county_info.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ConfigModule,
      JoiningWords,
      ScriptConfiguration,
      ScriptGeneration,
      CountrySources,
      CountriesInfo
    ]),
  ],
  providers: [OpenAIService],
  controllers: [OpenAIController],
})
export class OpenAIModule {}
