import { Test, TestingModule } from '@nestjs/testing';
import { JoiningWordsService } from './joining-words.service';

describe('JoiningWordsService', () => {
  let service: JoiningWordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JoiningWordsService],
    }).compile();

    service = module.get<JoiningWordsService>(JoiningWordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
