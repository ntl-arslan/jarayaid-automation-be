import { Test, TestingModule } from '@nestjs/testing';
import { CountySourcesService } from './county_sources.service';

describe('CountySourcesService', () => {
  let service: CountySourcesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CountySourcesService],
    }).compile();

    service = module.get<CountySourcesService>(CountySourcesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
