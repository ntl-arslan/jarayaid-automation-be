import { Test, TestingModule } from '@nestjs/testing';
import { ScriptConfigurationService } from './script-configuration.service';

describe('ScriptConfigurationService', () => {
  let service: ScriptConfigurationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScriptConfigurationService],
    }).compile();

    service = module.get<ScriptConfigurationService>(ScriptConfigurationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
