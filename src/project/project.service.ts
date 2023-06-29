/*
 * @Author: liuhongbo liuhongbo@dip-ai.com
 * @Date: 2023-06-12 17:52:54
 * @LastEditors: liuhongbo liuhongbo@dip-ai.com
 * @LastEditTime: 2023-06-28 17:23:25
 * @FilePath: /DailyWork/src/projectMangement/projectmangement.service.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Project, User } from '@prisma/client';
import { PrismaService } from 'src/prisima.service';
import { AddProjectDto, DeleteProjectDto, OrderProjectDto, ProjectDetailDto, UpdateProjectDto } from './dto/project.dto';
import { CommonResult } from 'src/types/common';
import { checkFinishTimeIsOverStartTime, formatTimeToShanghai, formatTimeToUtc } from 'src/utils/timeUtils';
import { TaskService } from 'src/task/task.service';
import { ColumnService } from 'src/column/column.service';
import { NotionService } from 'src/notion/notion.service';

@Injectable()
export class ProjectmangementService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly taskService: TaskService,
        private readonly columnService: ColumnService,
        private readonly notionService: NotionService,
    ) { }

    async add(user: User, addProjectDto: AddProjectDto): Promise<CommonResult> {
        // 检查项目是否存在
        const isProjectExist = !!(await this.findProjectByName(user.uid, addProjectDto.projectName))
        if (isProjectExist) {
            throw new HttpException('项目已存在！', HttpStatus.BAD_REQUEST)
        }
        // 检查结束时间是否大于开始时间
        if (addProjectDto.startTime && addProjectDto.finishTime) {
            checkFinishTimeIsOverStartTime(addProjectDto.startTime, addProjectDto.finishTime)
        }
        const projectNum = await this.prismaService.project.count({
            where: { creatorId: user.uid }
        })
        const newProjectData = {
            creatorId: user.uid,
            ...formatTimeToUtc(addProjectDto),
            order: projectNum
        }
        try {
            const newProject = await this.prismaService.project.create({
                data: newProjectData
            })
            if (!newProject) {
                throw new HttpException('项目创建失败！', HttpStatus.INTERNAL_SERVER_ERROR)
            }
            return {
                code: HttpStatus.OK,
                message: '项目创建成功！',
                result: null
            }
        } catch (error) {
            console.log('error', error)
            throw new HttpException('内部错误，项目创建失败！', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async delete(user: User, deleteProjectDto: DeleteProjectDto): Promise<CommonResult> {
        const { projectId } = deleteProjectDto
        const project = await this.prismaService.project.findUnique({
            where: {
                projectId: projectId
            }
        })
        if (!project) {
            throw new HttpException('项目不存在！', HttpStatus.NOT_FOUND)
        }
        if (project.creatorId !== user.uid) {
            throw new HttpException('无权限删除！', HttpStatus.FORBIDDEN)
        }

        try {
            this.prismaService.$transaction(async (prisma) => {
                const deleteProject = await prisma.project.delete({
                    where: {
                        projectId: projectId
                    }
                })

                if (!deleteProject) {
                    throw new HttpException('内部错误,项目删除失败!，项目删除失败！', HttpStatus.INTERNAL_SERVER_ERROR)
                }
                // 清除项目下的task, column, notion
                this.taskService.clearProjectTask(projectId)
                this.columnService.clearProjectColumn(projectId)
                this.notionService.clearProjectNotion({ projectId })
            })
            return {
                code: HttpStatus.OK,
                message: '项目删除成功!',
                result: null
            }
        } catch (error) {
            console.log('error', error)
            throw new HttpException('内部错误,项目删除失败!，项目删除失败！', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async list(user: User): Promise<CommonResult<Project[]>> {
        const projectList = await this.prismaService.project.findMany({
            where: {
                creatorId: user.uid
            },
            select: {
                projectId: true,
                projectName: true,
                startTime: true,
                finishTime: true,
                status: true,
                description: true,
                notion: true,
                order: true
            },
            orderBy: {
                order: 'asc',
            }
        })
        const result = projectList.map((item) => formatTimeToShanghai(item))
        return {
            code: HttpStatus.OK,
            message: '查询成功!',
            result: result
        }
    }

    async update(user: User, updateProjectDto: UpdateProjectDto): Promise<CommonResult> {
        const { projectId, projectName, startTime, finishTime } = updateProjectDto
        const project = await this.prismaService.project.findUnique({
            where: { projectId }
        })
        if (!project) {
            throw new HttpException('项目不存在！', HttpStatus.NOT_FOUND)
        }
        if (project.creatorId !== user.uid) {
            throw new HttpException('无权限修改！', HttpStatus.FORBIDDEN)
        }
        // 如果修改了项目时间，检查结束时间是否大于开始时间
        if ((startTime || project.startTime) && (finishTime || project.finishTime)) {
            checkFinishTimeIsOverStartTime(startTime || formatTimeToShanghai(project.startTime), finishTime || formatTimeToShanghai(project.finishTime))
        }
        try {
            const updateProject = await this.prismaService.project.update({
                where: { projectId },
                data: formatTimeToUtc(updateProjectDto)

            })
            if (!updateProject) {
                throw new HttpException('内部错误，项目修改失败！', HttpStatus.INTERNAL_SERVER_ERROR)
            }
            return {
                code: HttpStatus.OK,
                message: '项目修改成功!',
                result: null
            }
        } catch (error) {
            console.log('error', error)
            throw new HttpException('内部错误，项目修改失败！', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    // 根据项目名称查询项目
    async findProjectByName(uid: string, projectName: string): Promise<Project> {
        const project = await this.prismaService.project.findFirst({
            where: {
                creatorId: uid,
                projectName: projectName,
            }
        })
        return project
    }

    async order(orderProjectDto: OrderProjectDto): Promise<CommonResult> {
        const { projectIds } = orderProjectDto
        try {
            await this.prismaService.$transaction(async (prisma) => {
                const updateData = await Promise.all(projectIds.map(async (item, index) => {
                    await prisma.project.update({
                        where: { projectId: item },
                        data: { order: index }
                    })
                })
                )
            })
            return {
                code: HttpStatus.OK,
                message: '排序成功!',
                result: null
            }
        } catch (error) {
            console.log('error', error)
            throw new HttpException('内部错误，排序失败！', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async detail(projectDetailDto: ProjectDetailDto): Promise<CommonResult<Project>> {
        const { projectId } = projectDetailDto
        try {
            const result = await this.prismaService.project.findUnique({
                where: { projectId },
                select: {
                    projectId: true,
                    projectName: true,
                    startTime: true,
                    finishTime: true,
                    status: true,
                    description: true,
                    notion: true,
                    order: true
                },
            })
            return {
                code: HttpStatus.OK,
                message: '查询成功!',
                result: formatTimeToShanghai(result)
            }
        } catch (error) {
            console.log('error', error)
            throw new HttpException('内部错误，查询失败！', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
