import { Test, TestingModule } from '@nestjs/testing';
import { HygenService } from './hygen.service';

describe('HygenService', () => {
  let service: HygenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HygenService],
    }).compile();

    service = module.get<HygenService>(HygenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
