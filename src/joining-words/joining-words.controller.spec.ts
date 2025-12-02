import { Test, TestingModule } from '@nestjs/testing';
import { JoiningWordsController } from './joining-words.controller';
import { JoiningWordsService } from './joining-words.service';

describe('JoiningWordsController', () => {
  let controller: JoiningWordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JoiningWordsController],
      providers: [JoiningWordsService],
    }).compile();

    controller = module.get<JoiningWordsController>(JoiningWordsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
