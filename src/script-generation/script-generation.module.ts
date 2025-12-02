import { Module } from '@nestjs/common';
import { ScriptGenerationService } from './script-generation.service';
import { ScriptGenerationController } from './script-generation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountriesInfo } from 'src/county_sources/entities/county_info.entity';
import { HttpModule } from '@nestjs/axios';
import { ExternalApiService } from 'src/external-apis.service';
import { ScriptGeneration } from './entities/script-generation.entity';


@Module({
  imports: [
        TypeOrmModule.forFeature([ScriptGeneration,CountriesInfo]),
         HttpModule
      ],
  controllers: [ScriptGenerationController],
  providers: [ScriptGenerationService,ExternalApiService],
})
export class ScriptGenerationModule {}
