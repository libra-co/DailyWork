import { Module } from '@nestjs/common';
import { ScheduleTaskService } from './scheduletask.service';
import { ScheduleTaskController } from './scheduletask.controller';
import { RedisCacheProvider } from 'src/redis/redis.cache.provider';

@Module({
  controllers: [ScheduleTaskController],
  providers: [ScheduleTaskService,RedisCacheProvider]
})
export class ScheduleTaskModule {}
