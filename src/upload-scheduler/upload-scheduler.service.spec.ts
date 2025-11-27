import { Test, TestingModule } from '@nestjs/testing';
import { UploadSchedulerService } from './upload-scheduler.service';

describe('UploadSchedulerService', () => {
  let service: UploadSchedulerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadSchedulerService],
    }).compile();

    service = module.get<UploadSchedulerService>(UploadSchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
