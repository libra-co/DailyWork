/*
 * @Author: liuhongbo liuhongbo@dip-ai.com
 * @Date: 2023-06-14 15:53:15
 * @LastEditors: liuhongbo 916196375@qq.com
 * @LastEditTime: 2023-06-22 17:41:15
 * @FilePath: /DailyWork/src/task/task.service.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Task, User } from '@prisma/client';
import { PrismaService } from 'src/prisima.service';
import { DeleteTaskDto, ProjectTaskReturnDto, TaskAddDto, TaskDetailDto, TaskListDto, UpdateTaskDto } from './dto/task.dto';
import { CommonResult } from 'src/types/common';
import { checkFinishTimeIsOverStartTime, formatTimeToShanghai, formatTimeToUtc } from 'src/utils/timeUtils';
import { ColumnService } from 'src/column/column.service';

@Injectable()
export class TaskService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly columnService: ColumnService
    ) { }

    async add(user: User, addTaskDto: TaskAddDto): Promise<CommonResult> {
        const addTaskData = formatTimeToUtc({ ...addTaskDto, creatorId: user.uid, assigneeId: user.uid })
        if ('customItemList' in addTaskDto) {
            addTaskData.customItemList = JSON.stringify(addTaskDto.customItemList)
        }
        const successResult: CommonResult = {
            code: HttpStatus.OK,
            message: '任务创建成功！',
            result: null
        }
        if (addTaskDto.startTime && addTaskDto.finishTime) {
            checkFinishTimeIsOverStartTime(addTaskDto.startTime, addTaskDto.finishTime)
        }
        // 创建一个新列和任务(新增任务需要新增一列时)
        const addNewColumnAndTask = async (): Promise<CommonResult> => {
            try {
                const column = await this.prismaService.column.create({
                    data: { projectId: addTaskDto.projectId, columnName: `模块${columns.length + 1}`, order: columns.length }
                })
                const newTask = await this.prismaService.task.create({
                    data: { ...addTaskData, columnId: column.columnId }
                })
                return successResult
            } catch (error) {
                console.log('error', error)
                throw new HttpException('内部错误，任务创建失败！', HttpStatus.INTERNAL_SERVER_ERROR)
            }
        }
        const columns = await (await this.columnService.list({ projectId: addTaskDto.projectId })).result
        // 空项目时新增列和任务
        if (columns.length === 0) {
            return await addNewColumnAndTask()
        }

        const parentTask = addTaskDto.parentTaskId
            ? await this.prismaService.task.findUnique({
                where: {
                    taskId: addTaskDto.parentTaskId
                }
            })
            : null
        const parentTaskColumnIndex = parentTask ? columns.findIndex(column => column.columnId === parentTask.columnId) : -1
        // 新增任务需要新增一列时
        if (parentTaskColumnIndex === columns.length - 1) {
            return await addNewColumnAndTask()
        } else {
            // 新增任务不需要新增一列时
            const nextColumnId = columns[parentTaskColumnIndex + 1].columnId
            try {
                const newTask = await this.prismaService.task.create({
                    data: { ...addTaskData, columnId: nextColumnId }
                })
                if (!newTask) {
                    throw new HttpException('内部错误，任务创建失败！', HttpStatus.INTERNAL_SERVER_ERROR)
                }
                return successResult
            } catch (error) {
                console.log('error', error)
                throw new HttpException('内部错误，任务创建失败！', HttpStatus.INTERNAL_SERVER_ERROR)
            }
        }
    }

    async delete(user: User, deleteTaskDto: DeleteTaskDto): Promise<CommonResult> {
        const { taskId } = deleteTaskDto
        const successReturn: CommonResult = {
            code: HttpStatus.OK,
            message: '任务删除成功！',
            result: null
        }
        const task = await this.prismaService.task.findUnique({
            where: {
                taskId: taskId
            }
        })
        if (!task) {
            throw new HttpException('任务不存在！', HttpStatus.NOT_FOUND)
        }
        if (task.creatorId !== user.uid) {
            throw new HttpException('无权限删除！', HttpStatus.FORBIDDEN)
        }
        // 是否有子任务
        const taskChildren = await this.prismaService.task.findMany({
            where: {
                parentTaskId: taskId
            }
        })
        if (taskChildren.length) {
            try {
                await this.prismaService.$transaction(async (prisma) => {
                    // 更新子任务的父任务层级
                    await prisma.task.updateMany({
                        where: { OR: taskChildren.map(task => ({ taskId: task.taskId })) },
                        data: { parentTaskId: task.parentTaskId }
                    })
                    // 删除当前任务
                    await prisma.task.delete({
                        where: { taskId },
                    })
                })
                return successReturn
            } catch (error) {
                console.log('error', error)
                throw new HttpException('内部错误，任务删除失败！', HttpStatus.INTERNAL_SERVER_ERROR)
            }
        }

        try {
            const deleteTask = await this.prismaService.task.delete({
                where: {
                    taskId: taskId
                }
            })
            await this.columnService.checkAndDeleteEmptyColumn(task.projectId, task.columnId)
            if (!deleteTask) {
                throw new HttpException('内部错误，任务删除失败！', HttpStatus.INTERNAL_SERVER_ERROR)
            }
            return successReturn
        } catch (error) {
            console.log('error', error)
            throw new HttpException('内部错误，任务删除失败！', HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }


    async update(user: User, updateTaskDto: UpdateTaskDto): Promise<CommonResult> {
        const { taskId, parentTaskId } = updateTaskDto
        const { isMoveWithChildren, ...updateData } = updateTaskDto
        if ('customItemList' in updateTaskDto) {
            updateData.customItemList = JSON.stringify(updateTaskDto.customItemList)
        }
        const successReturn: CommonResult = {
            code: HttpStatus.OK,
            message: '任务修改成功！',
            result: null
        }
        const task = await this.prismaService.task.findUnique({
            where: {
                taskId: taskId
            }
        })
        if (!task) {
            throw new HttpException('任务不存在！', HttpStatus.NOT_FOUND)
        }
        if (task.creatorId !== user.uid) {
            throw new HttpException('无权限修改！', HttpStatus.FORBIDDEN)
        }
        if (task.parentTaskId === updateTaskDto.parentTaskId) {
            delete updateData.parentTaskId
            delete updateTaskDto.parentTaskId
        }
        // 如果修改了开始时间或者结束时间，需要判断结束时间是否大于开始时间
        if ((updateTaskDto.startTime || task.startTime) && (updateTaskDto.finishTime || task.finishTime)) {
            checkFinishTimeIsOverStartTime(updateTaskDto.startTime || formatTimeToShanghai(task.startTime), updateTaskDto.finishTime || formatTimeToShanghai(task.finishTime))
        }

        // 移动任务,且带不带子任务一起移动
        if ('parentTaskId' in updateTaskDto) {
            // 移动目标位置的父任务
            const targetParentTask = await this.prismaService.task.findUnique({
                where: { taskId: parentTaskId }
            })
            // 项目下的所有列
            const projectColumns = await this.prismaService.column.findMany({
                where: { projectId: task.projectId }
            })
            // 当前修改任务的子任务
            const currentChildrenTasks = await this.prismaService.task.findMany({
                where: {
                    parentTaskId: taskId
                }
            })
            // 当前更新的任务以及其子任务的任务树
            const currentTaskTree = (await this.fildTaskChildren(task.projectId, taskId)).result[0]
            // 是否移动任务到另一个任务下
            if (isMoveWithChildren) {
                // 移动任务以及其子任务
                if (currentChildrenTasks.length) {
                    try {
                        const result = await this.prismaService.$transaction(async (prisma) => {
                            /**
                             * 
                             * @param tasks 当然任务带子任务
                             * @param index 父任务移动前的位置
                             */
                            const generateChildrenTaskData = async (tasks, index: number) => {
                                await Promise.all(currentTaskTree.children.map(async task => {
                                    await prisma.task.update({
                                        where: { taskId: task.taskId },
                                        data: {
                                            columnId: projectColumns[index + 1].columnId
                                        }
                                    })
                                    if (task.children) {
                                        return generateChildrenTaskData(task.children, index++)
                                    }
                                    return task
                                })
                                )
                            }
                            const childrenTaskData = await generateChildrenTaskData(currentTaskTree, projectColumns.findIndex(column => column.columnId === targetParentTask.columnId) + 1)
                        })
                        await this.columnService.checkAndDeleteEmptyColumn(task.projectId)
                        return successReturn
                    } catch (error) {
                        console.log('error', error)
                        throw new HttpException('内部错误，任务移动失败！', HttpStatus.INTERNAL_SERVER_ERROR)
                    }
                }
            } else {
                if (currentChildrenTasks.length) {
                    try {
                        const result = await this.prismaService.$transaction(async (prisma) => {
                            /**
                             * 
                             * @param tasks 当然任务带子任务
                             * @param index 父任务移动前的位置
                             */
                            const generateChildrenTaskData = async (tasks, index: number) => {
                                await Promise.all(currentTaskTree.children.map(async task => {
                                    await prisma.task.update({
                                        where: { taskId: task.taskId },
                                        data: {
                                            columnId: projectColumns[index].columnId
                                        }
                                    })
                                    if (task.children) {
                                        return generateChildrenTaskData(task.children, index++)
                                    }
                                    return task
                                })
                                )
                            }
                            const childrenTaskData = await generateChildrenTaskData(currentTaskTree.children, projectColumns.findIndex(column => column.columnId === task.columnId) + 1)

                            await prisma.task.update({
                                where: {
                                    taskId: taskId,
                                },
                                data: { parentTaskId: parentTaskId }
                            })
                        }
                        )
                        await this.columnService.checkAndDeleteEmptyColumn(task.projectId)
                        return successReturn
                    } catch (error) {
                        console.log('error', error)
                        throw new HttpException('内部错误，任务修改失败！', HttpStatus.INTERNAL_SERVER_ERROR)
                    }
                }
                // 如果移动时,任务没有子任务,则直接移动
                try {
                    const targetParentTaskColumnIndex = projectColumns.findIndex(column => column.columnId === targetParentTask.columnId)
                    // 是否需要创建新的列
                    if (projectColumns.length <= targetParentTaskColumnIndex + 1) {
                        const newColumn = await this.prismaService.column.create({
                            data: {
                                projectId: task.projectId,
                                columnName: `模块${projectColumns.length + 1}`,
                                order: projectColumns.length
                            }
                        })
                        projectColumns.push(newColumn)
                    }
                    const result = await this.prismaService.$transaction(async (prisma) => {
                        await prisma.task.update({
                            where: {
                                taskId: taskId
                            },
                            data: {
                                ...formatTimeToUtc(updateData),
                                parentTaskId: parentTaskId,
                                columnId: projectColumns.at(targetParentTaskColumnIndex + 1).columnId
                            }
                        })
                    })

                    await this.columnService.checkAndDeleteEmptyColumn(task.projectId, task.columnId)
                    return successReturn
                } catch (error) {
                    console.log('error', error)
                    throw new HttpException('内部错误，任务移动失败！', HttpStatus.INTERNAL_SERVER_ERROR)
                }
            }
        }

        try {
            const updateTask = await this.prismaService.task.update({
                where: {
                    taskId: taskId
                },
                data: formatTimeToUtc(updateData)
            })
            if (!updateTask) {
                throw new HttpException('内部错误，任务修改失败！', HttpStatus.INTERNAL_SERVER_ERROR)
            }
            return {
                code: HttpStatus.OK,
                message: '任务修改成功！',
                result: null
            }
        } catch (error) {
            console.log('error', error)
            throw new HttpException('内部错误，任务修改失败！', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getProjectTaskList(taskListDto: TaskListDto): Promise<CommonResult<(Task & { children: Task[]; })[]>> {
        try {
            const taskList = (await this.prismaService.task.findMany({
                where: {
                    projectId: taskListDto.projectId,
                    parentTaskId: ''
                },
                orderBy: {
                    createdTime: 'asc'
                }
            })).map(task => {
                if ('customItemList' in task) {
                    task.customItemList = JSON.parse(task.customItemList)
                }
                return task
            })
            // 递归查询子任务，转换时间为上海时间
            const searchChildrenTask = (taskList: Task[]) => {
                return Promise.all(taskList.map(async (task: Task & { children: Task[] }) => {
                    task = formatTimeToShanghai(task) // 转换为上海时间
                    const childrenTasks = (await this.prismaService.task.findMany({
                        where: {
                            parentTaskId: task.taskId
                        },
                        orderBy: {
                            createdTime: 'asc'
                        }
                    })).map(task => {
                        if ('customItemList' in task) {
                            task.customItemList = JSON.parse(task.customItemList)
                        }
                        return task
                    })
                    if (childrenTasks.length > 0) {
                        task.children = await searchChildrenTask(childrenTasks)
                    }
                    return task
                }))
            }
            const result = taskList.length === 0 ? [] : await searchChildrenTask(taskList)
            return {
                code: HttpStatus.OK,
                message: '任务列表获取成功！',
                result: result
            }
        } catch (error) {
            console.log('error', error)
            throw new HttpException('内部错误，任务列表获取失败！', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    // 查询指定任务的子任务
    async fildTaskChildren(projectId: string, taskId: string): Promise<CommonResult<ProjectTaskReturnDto[]>> {
        try {
            const taskList = await this.prismaService.task.findMany({
                where: { projectId, taskId }
            }) as unknown as ProjectTaskReturnDto[]
            taskList.forEach(task => {
                if ('customItemList' in task) {
                    task.customItemList = JSON.parse(task.customItemList as unknown as string)
                }
            })
            // 递归查询子任务，转换时间为上海时间
            const searchChildrenTask = (taskList) => {
                return Promise.all(taskList.map(async (task: ProjectTaskReturnDto) => {
                    task = formatTimeToShanghai(task) // 转换为上海时间
                    const childrenTasks = (await this.prismaService.task.findMany({
                        where: {
                            parentTaskId: task.taskId
                        },
                    })).map(task => {
                        if ('customItemList' in task) {
                            task.customItemList = JSON.parse(task.customItemList as unknown as string)
                        }
                        return task
                    })
                    if (childrenTasks.length > 0) {
                        task.children = await searchChildrenTask(childrenTasks)
                    }
                    return task
                }))
            }
            const result = taskList.length === 0 ? [] : await searchChildrenTask(taskList)
            return {
                code: HttpStatus.OK,
                message: '任务列表获取成功！',
                result: result
            }
        } catch (error) {
            console.log('error', error)
            throw new HttpException('内部错误，任务列表获取失败！', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    async getTaskDetail(taskListDto: TaskDetailDto): Promise<CommonResult<Task>> {
        const { taskId } = taskListDto
        try {
            const task = await this.prismaService.task.findUnique({
                where: {
                    taskId: taskId
                }
            })
            if (!task) {
                throw new HttpException('任务不存在！', HttpStatus.NOT_FOUND)
            }
            if ('customItemList' in task) {
                task.customItemList = JSON.parse(task.customItemList)
            }
            return {
                code: HttpStatus.OK,
                message: '任务详情获取成功！',
                result: formatTimeToShanghai(task)
            }
        } catch (error) {
            console.log('error', error)
            throw new HttpException('内部错误，任务详情获取失败！', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async clearProjectTask(projectId: string): Promise<CommonResult> {
        try {
            const result = await this.prismaService.task.deleteMany({
                where: { projectId }
            })
            return {
                code: HttpStatus.OK,
                message: '任务清空成功！',
                result: null
            }
        } catch (error) {
            console.log('error', error)
            return {
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                message: '内部错误,任务清空！',
                result: null
            }
        }
    }

}
