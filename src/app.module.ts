import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CountySourcesModule } from './county_sources/county_sources.module';
import { UploadSchedulerModule } from './upload-scheduler/upload-scheduler.module';
import { SponsorModule } from './sponsor/sponsor.module';
import { SponsorCountriesModule } from './sponsor-countries/sponsor-countries.module';
import { ScriptGenerationModule } from './script-generation/script-generation.module';
import { JoiningWordsModule } from './joining-words/joining-words.module';
import { ScriptConfigurationModule } from './script-configuration/script-configuration.module';
import { YoutubeModule } from './upload-scripts/youtube.module';
import { OpenAIModule } from './open-ai/open-ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
    }),

    CountySourcesModule,

    UploadSchedulerModule,

    SponsorModule,

    SponsorCountriesModule,

    ScriptGenerationModule,

    JoiningWordsModule,

    ScriptConfigurationModule,
    
    YoutubeModule,
    
    OpenAIModule
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
