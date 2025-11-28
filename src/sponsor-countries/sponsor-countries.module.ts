import { Module } from '@nestjs/common';
import { SponsorCountriesService } from './sponsor-countries.service';
import { SponsorCountriesController } from './sponsor-countries.controller';

@Module({
  controllers: [SponsorCountriesController],
  providers: [SponsorCountriesService],
})
export class SponsorCountriesModule {}
