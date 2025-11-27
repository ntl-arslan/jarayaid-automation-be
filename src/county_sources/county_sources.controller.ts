import { Controller,Post, Body, Get, Put, ParseIntPipe, Param } from '@nestjs/common';
import { CountySourcesService } from './county_sources.service';
import { CreateCountriesInfoDto } from './dto/create-county_source.dto';
import { UpdateCountriesInfoDto } from './dto/update-county_source.dto';

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
	

}
