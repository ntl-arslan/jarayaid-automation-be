import { Test, TestingModule } from '@nestjs/testing';
import { HygenController } from './hygen.controller';
import { HygenService } from './hygen.service';

describe('HygenController', () => {
  let controller: HygenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HygenController],
      providers: [HygenService],
    }).compile();

    controller = module.get<HygenController>(HygenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
