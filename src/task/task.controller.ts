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
}
