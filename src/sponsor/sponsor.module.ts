import { Module } from '@nestjs/common';
import { SponsorService } from './sponsor.service';
import { SponsorController } from './sponsor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sponsor } from './entities/sponsor.entity';
import { SponsorCountry } from 'src/sponsor-countries/entities/sponsor-country.entity';
import { HttpModule } from '@nestjs/axios';
import { ExternalApiService } from 'src/external-apis.service';

@Module({
	 imports: [
			TypeOrmModule.forFeature([Sponsor,SponsorCountry]),
			 HttpModule
		],
	controllers: [SponsorController],
	providers: [SponsorService,ExternalApiService],
})
export class SponsorModule {}
