import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleTaskService } from './scheduletask.service';

describe('ScheduleTaskService', () => {
  let service: ScheduleTaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduleTaskService],
    }).compile();

    service = module.get<ScheduleTaskService>(ScheduleTaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
