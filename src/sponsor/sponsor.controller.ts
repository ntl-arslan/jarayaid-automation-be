import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SponsorService } from './sponsor.service';
import { CreateSponsorDto } from './dto/create-sponsor.dto';
import { UpdateSponsorDto } from './dto/update-sponsor.dto';

@Controller('sponsor')
export class SponsorController {
	constructor(private readonly sponsorService: SponsorService) {}

	@Post()
	create(@Body() createSponsorDto: CreateSponsorDto) {
		return this.sponsorService.createSponsor(createSponsorDto);
	}
	
	@Get()
	async getAllSponsors() {
		return this.sponsorService.getAllSponsors();
	}
	
	@Get('active')
	async getAllActiveSponsors() {
		return this.sponsorService.getAllActiveSponsors();
	}	
}
