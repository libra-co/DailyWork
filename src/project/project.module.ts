/*
 * @Author: liuhongbo liuhongbo@dip-ai.com
 * @Date: 2023-06-12 17:52:54
 * @LastEditors: liuhongbo liuhongbo@dip-ai.com
 * @LastEditTime: 2023-06-12 17:53:39
 * @FilePath: /DailyWork/src/projectMangement/projectmangement.module.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Module } from '@nestjs/common';
import { ProjectmangementService } from './project.service';
import { ProjectmangementController } from './project.controller';
import { PrismaService } from 'src/prisima.service';
import { TaskService } from 'src/task/task.service';
import { ColumnService } from 'src/column/column.service';
import { NotionService } from 'src/notion/notion.service';

@Module({
  controllers: [ProjectmangementController],
  providers: [ProjectmangementService, PrismaService,TaskService,ColumnService,NotionService]
})
export class ProjectmangementModule { }
