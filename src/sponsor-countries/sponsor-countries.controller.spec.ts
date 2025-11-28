import { Test, TestingModule } from '@nestjs/testing';
import { SponsorCountriesController } from './sponsor-countries.controller';
import { SponsorCountriesService } from './sponsor-countries.service';

describe('SponsorCountriesController', () => {
  let controller: SponsorCountriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SponsorCountriesController],
      providers: [SponsorCountriesService],
    }).compile();

    controller = module.get<SponsorCountriesController>(SponsorCountriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
