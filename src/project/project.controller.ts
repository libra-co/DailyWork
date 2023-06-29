/*
 * @Author: liuhongbo liuhongbo@dip-ai.com
 * @Date: 2023-06-12 17:52:54
 * @LastEditors: liuhongbo liuhongbo@dip-ai.com
 * @LastEditTime: 2023-06-25 10:39:23
 * @FilePath: /DailyWork/src/projectList/projectList.controller.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Body, Controller, Delete, Get, Post, Query, Req } from '@nestjs/common';
import { ProjectmangementService } from './project.service';
import { Request } from 'express';
import { AddProjectDto, DeleteProjectDto, UpdateProjectDto, OrderProjectDto, ProjectDetailDto } from './dto/project.dto';
import { User } from '@prisma/client';

@Controller('project')
export class ProjectmangementController {
  constructor(private readonly projectmangementService: ProjectmangementService) { }

  @Post('add')
  async addProject(@Req() req, @Body() addProjectDto: AddProjectDto) {
    return this.projectmangementService.add(req.user as User, addProjectDto)
  }

  @Get('list')
  async projectList(@Req() req: Request) {
    return this.projectmangementService.list(req.user as User)
  }

  @Post('delete')
  async deleteProject(@Req() req: Request, @Body() deleteProjectDto: DeleteProjectDto) {
    return this.projectmangementService.delete(req.user as User, deleteProjectDto)
  }

  @Post('update')
  async updateProject(@Req() req: Request, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectmangementService.update(req.user as User, updateProjectDto)
  }

  @Post('order')
  async orderProject(@Req() req: Request, @Body() orderProjectDto: OrderProjectDto) {
    return this.projectmangementService.order(orderProjectDto)
  }

  @Get('detail')
  async projectDetail(@Req() req: Request, @Query() projectDetailDto: ProjectDetailDto) {
    return this.projectmangementService.detail(projectDetailDto)
  }
}
