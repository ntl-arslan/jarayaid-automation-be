import { Controller,Post, Body, Get, Put, ParseIntPipe, Param, Delete } from '@nestjs/common';
import { CountySourcesService } from './county_sources.service';
import { CreateCountriesInfoDto } from './dto/create-county_source.dto';
import { UpdateCountriesInfoDto } from './dto/update-county_source.dto';
import { DeleteCountryInfoDto } from './dto/delete-country_source.dt';

@Controller('country-sources')
export class CountySourcesController {
	constructor(private readonly countySourcesService: CountySourcesService) {}

	@Post()
	create(@Body() createCountySourceDto: CreateCountriesInfoDto) {
		return this.countySourcesService.createCountrySources(createCountySourceDto);
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
		return await this.countySourcesService.updateCountrySources(id, updateCountriesInfoDto);
	}
	
	
	@Delete(':id')
	async deleteCountrySources(
		@Param('id', ParseIntPipe) id: number,
		@Body() deleteCountryInfoDto: DeleteCountryInfoDto
	) {
		return await this.countySourcesService.deleteCountrySources(id,deleteCountryInfoDto);
	}
	
	@Get('active')
	async getAllActiveCountySources() {
		return await this.countySourcesService.getAllActiveCountySources();
	}
	
	
	// @Get('active')
	// async getActiveCountryByType(
	// 		@Param('type') type: string,
	// ) {
	// 	return await this.countySourcesService.getActiveCountryByType();
	// }
	
	
	
	

}
