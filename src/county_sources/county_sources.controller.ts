import {
	Controller,
	Post,
	Body,
	Get,
	Put,
	ParseIntPipe,
	Param,
	Delete,
	ParseEnumPipe,
} from '@nestjs/common';
import { CountySourcesService } from './county_sources.service';
import { CreateCountriesInfoDto, CreateCountrySourceDto } from './dto/create-county_source.dto';
import { UpdateCountriesInfoDto } from './dto/update-county_source.dto';
import { DeleteCountryInfoDto } from './dto/delete-country_source.dt';
import { CountryType } from 'src/constants/constants';
import { UpdateSourceDto } from './dto/update-source.dto';
import { UpdateBulkSourceDto } from './dto/update-bulk-sources-dto';

@Controller('country-sources')
export class CountySourcesController {
	constructor(private readonly countySourcesService: CountySourcesService) {}

	@Post()
	create(@Body() createCountySourceDto: CreateCountriesInfoDto) {
		return this.countySourcesService.createCountrySources(
			createCountySourceDto,
		);
	}
	@Post('source')
  createSource(@Body() createCountrySourceDto: CreateCountrySourceDto) {
	return this.countySourcesService.createSource(
	  createCountrySourceDto,
	);
  }

	@Get()
	async getAllCountries() {
		return await this.countySourcesService.getAllCountySources();
	}

	@Put(':id')
	async updateCountry(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateCountriesInfoDto: UpdateCountriesInfoDto,
	) {
		return await this.countySourcesService.updateCountrySources(
			id,
			updateCountriesInfoDto,
		);
	}

	@Delete(':id')
	async deleteCountrySources(
		@Param('id', ParseIntPipe) id: number,
		@Body() deleteCountryInfoDto: DeleteCountryInfoDto,
	) {
		return await this.countySourcesService.deleteCountrySources(
			id,
			deleteCountryInfoDto,
		);
	}

	@Get('active')
	async getAllActiveCountySources() {
		return await this.countySourcesService.getAllActiveCountySources();
	}

	// @Get('active/:type')
	// async getActiveCountryByType(@Param('type') type: CountryType) {
	// 	return await this.countySourcesService.getAllCountySourcesByType(type);
	// }

	@Get('sources/:countryID')
	async getSourcesByCountryID(@Param('countryID') countryID: string) {
		return await this.countySourcesService.getSourcesByCountryID(countryID);
	}

	@Put('sources/:sourceID')
	async updateSourceByID(
		@Param('sourceID', ParseIntPipe) sourceID: number,
		@Body() updateSourceDto: UpdateSourceDto,
	) {
		return await this.countySourcesService.updateCountrySourceByID(
			sourceID,
			updateSourceDto,
		);
	}
	
		//BULK UPDATE SOURCE DTO
	@Put('/bulk/sources')
	async bulkUpdateSource(
		@Body() updateBulkSourceDto: UpdateBulkSourceDto,
	) {
		return await this.countySourcesService.bulkUpdateSource(
			updateBulkSourceDto,
		);
	}
}
