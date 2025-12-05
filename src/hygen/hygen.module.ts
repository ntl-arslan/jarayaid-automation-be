import { Module } from '@nestjs/common';
import { HeygenController } from './hygen.controller';
import { HeygenService } from './hygen.service';
import { CountriesInfo } from 'src/county_sources/entities/county_info.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScriptGeneration } from 'src/script-generation/entities/script-generation.entity';
import { Sponsor } from 'src/sponsor/entities/sponsor.entity';
import { SponsorCountry } from 'src/sponsor-countries/entities/sponsor-country.entity';
import { CountrySources } from 'src/county_sources/entities/country_source.entity';


@Module({
	 imports: [
					TypeOrmModule.forFeature([CountriesInfo,ScriptGeneration,Sponsor,SponsorCountry,CountrySources])
				],
	controllers: [HeygenController],
	providers: [HeygenService],
})
export class HygenModule {}
