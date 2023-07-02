import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleTaskController } from './scheduletask.controller';
import { ScheduleTaskService } from './scheduletask.service';

describe('ScheduleTaskController', () => {
  let controller: ScheduleTaskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduleTaskController],
      providers: [ScheduleTaskService],
    }).compile();

    controller = module.get<ScheduleTaskController>(ScheduleTaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
