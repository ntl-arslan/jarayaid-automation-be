import { Test, TestingModule } from '@nestjs/testing';
import { SponsorCountriesService } from './sponsor-countries.service';

describe('SponsorCountriesService', () => {
  let service: SponsorCountriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SponsorCountriesService],
    }).compile();

    service = module.get<SponsorCountriesService>(SponsorCountriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
