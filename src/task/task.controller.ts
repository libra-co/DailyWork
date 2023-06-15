/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-15 11:43:46
 * @LastEditors: liuhongbo 916196375@qq.com
 * @LastEditTime: 2023-06-15 12:05:42
 * @FilePath: \daily-work\src\task\task.controller.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Body, Controller, Get, Post, Query, Req, Request } from '@nestjs/common';
import { TaskService } from './task.service';
import { User } from '@prisma/client';
import { DeleteTaskDto, TaskAddDto, TaskListDto, UpdateTaskDto } from './dto/task.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @Post('add')
  async add(@Request() req, @Body() addTaskDto: TaskAddDto) {
    return this.taskService.add(req.user, addTaskDto);
  }

  @Post('delete')
  async delete(@Req() req, @Body() deleteTaskDto: DeleteTaskDto) {
    return this.taskService.delete(req.user, deleteTaskDto);
  }

  @Post('update')
  async update(@Req() req, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(req.user, updateTaskDto);
  }

  @Get('list')
  async list(@Query() taskListDto: TaskListDto) {
    return this.taskService.getProjectTaskList(taskListDto);
  }

  @Get('detail')
  async detail(@Query() taskListDto: TaskListDto) {
    return this.taskService.getProjectTaskList(taskListDto);
  }

}
