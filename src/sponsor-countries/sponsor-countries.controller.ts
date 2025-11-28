import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SponsorCountriesService } from './sponsor-countries.service';
import { CreateSponsorDto } from 'src/sponsor/dto/create-sponsor.dto';



@Controller('sponsor-countries')
export class SponsorCountriesController {
  constructor(private readonly sponsorCountriesService: SponsorCountriesService) {}

  // @Post()
  // create(@Body() createSponsorDto: CreateSponsorDto) {
  //   return this.sponsorCountriesService.createSponsor(createSponsorDto);
  // }

 
}
