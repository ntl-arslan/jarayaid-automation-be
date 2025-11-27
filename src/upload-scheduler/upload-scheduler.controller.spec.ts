import { Test, TestingModule } from '@nestjs/testing';
import { UploadSchedulerController } from './upload-scheduler.controller';
import { UploadSchedulerService } from './upload-scheduler.service';

describe('UploadSchedulerController', () => {
  let controller: UploadSchedulerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadSchedulerController],
      providers: [UploadSchedulerService],
    }).compile();

    controller = module.get<UploadSchedulerController>(UploadSchedulerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
