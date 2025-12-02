import { Test, TestingModule } from '@nestjs/testing';
import { ScriptConfigurationController } from './script-configuration.controller';
import { ScriptConfigurationService } from './script-configuration.service';

describe('ScriptConfigurationController', () => {
  let controller: ScriptConfigurationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScriptConfigurationController],
      providers: [ScriptConfigurationService],
    }).compile();

    controller = module.get<ScriptConfigurationController>(ScriptConfigurationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
