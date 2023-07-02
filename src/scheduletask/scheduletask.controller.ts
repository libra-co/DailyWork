import { Controller } from '@nestjs/common';
import { ScheduleTaskService } from './scheduletask.service';

@Controller('schedule-task')
export class ScheduleTaskController {
  constructor(private readonly scheduleTaskService: ScheduleTaskService) {}
}
