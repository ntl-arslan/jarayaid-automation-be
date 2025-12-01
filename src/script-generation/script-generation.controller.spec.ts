import { Test, TestingModule } from '@nestjs/testing';
import { ScriptGenerationController } from './script-generation.controller';
import { ScriptGenerationService } from './script-generation.service';

describe('ScriptGenerationController', () => {
  let controller: ScriptGenerationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScriptGenerationController],
      providers: [ScriptGenerationService],
    }).compile();

    controller = module.get<ScriptGenerationController>(ScriptGenerationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
