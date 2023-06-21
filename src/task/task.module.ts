/*
 * @Author: liuhongbo liuhongbo@dip-ai.com
 * @Date: 2023-06-14 15:53:15
 * @LastEditors: liuhongbo 916196375@qq.com
 * @LastEditTime: 2023-06-16 21:34:12
 * @FilePath: /DailyWork/src/task/task.module.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { PrismaService } from 'src/prisima.service';
import { ColumnService } from 'src/column/column.service';
import { ColumnModule } from 'src/column/column.module';

@Module({
  imports: [],
  controllers: [TaskController],
  providers: [TaskService, PrismaService,ColumnService]
})
export class TaskModule { }
