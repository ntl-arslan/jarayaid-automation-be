import { Injectable } from '@nestjs/common';
import { CreateSponsorDto } from 'src/sponsor/dto/create-sponsor.dto';
import { Sponsor } from 'src/sponsor/entities/sponsor.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SponsorCountry } from './entities/sponsor-country.entity';

@Injectable()
export class SponsorCountriesService {


}
