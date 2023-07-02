/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-03 14:30:12
 * @LastEditors: liuhongbo 916196375@qq.com
 * @LastEditTime: 2023-07-01 23:52:56
 * @FilePath: \daily-work\src\app.module.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisima.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './auth/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwtAuthGuard.guard';
import { ProjectmangementModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { ColumnModule } from './column/column.module';
import { NotionModule } from './notion/notion.module';
import { RedisCacheProvider } from './redis/redis.cache.provider';
import { ScheduleTaskModule } from './scheduletask/scheduletask.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduleTaskService } from './scheduletask/scheduletask.service';

@Module({
  imports: [UserModule, AuthModule, ProjectmangementModule, TaskModule, ColumnModule, NotionModule, ScheduleTaskModule, ScheduleModule.forRoot(),],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    JwtStrategy,
    RedisCacheProvider,
    ScheduleTaskService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },],
})
export class AppModule {

}
