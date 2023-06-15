/*
 * @Author: liuhongbo liuhongbo@dip-ai.com
 * @Date: 2023-06-14 15:53:15
 * @LastEditors: liuhongbo liuhongbo@dip-ai.com
 * @LastEditTime: 2023-06-14 17:46:35
 * @FilePath: /DailyWork/src/task/task.module.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { PrismaService } from 'src/prisima.service';

@Module({
  controllers: [TaskController],
  providers: [TaskService, PrismaService]
})
export class TaskModule { }
