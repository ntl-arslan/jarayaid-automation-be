import { Test, TestingModule } from '@nestjs/testing';
import { CountySourcesController } from './county_sources.controller';
import { CountySourcesService } from './county_sources.service';

describe('CountySourcesController', () => {
  let controller: CountySourcesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountySourcesController],
      providers: [CountySourcesService],
    }).compile();

    controller = module.get<CountySourcesController>(CountySourcesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
