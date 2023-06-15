/*
 * @Author: liuhongbo liuhongbo@dip-ai.com
 * @Date: 2023-06-14 15:54:22
 * @LastEditors: liuhongbo 916196375@qq.com
 * @LastEditTime: 2023-06-15 12:58:08
 * @FilePath: /DailyWork/src/task/dto/task.dto.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Allow, IsDateString, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { TaskStatusEnum } from "../const";

export class TaskAddDto {
    @IsString()
    projectId: string

    @IsString()
    taskName: string

    @IsOptional()
    @IsEnum(TaskStatusEnum)
    status?: TaskStatusEnum

    @IsOptional()
    @IsDateString()
    startTime?: string

    @IsOptional()
    @IsDateString()
    finishTime?: string

    @IsOptional()
    @IsString()
    parentTaskId?: string

    @IsOptional()
    @IsString()
    description?: string
}

export class DeleteTaskDto {
    @IsString()
    taskId: string
}

export class UpdateTaskDto {
    @IsString()
    taskId: string

    @IsOptional()
    @IsString()
    taskName?: string

    @IsOptional()
    @IsEnum(TaskStatusEnum)
    status?: TaskStatusEnum

    @IsOptional()
    @IsDateString()
    startTime?: string

    @IsOptional()
    @IsDateString()
    finishTime?: string

    @IsOptional()
    @IsString()
    @Allow(null)
    parentTaskId?: string

    @IsOptional()
    @IsString()
    description?: string

    @IsOptional()
    @IsNumber()
    isMoveWithChildren?: 0 | 1  // 是否移动时带着子任务 0: 不移动 1: 移动
}

export class TaskListDto {
    @IsString()
    projectId: string
}

export class ProjectTaskReturnDto {
    taskId: string
    taskName: string
    status: TaskStatusEnum
    startTime: string
    finishTime: string
    parentTaskId: string
    description: string
    creatorId: string
    assigneeId: string
    projectId: string
    createdAt: string
    updatedAt: string
    children: ProjectTaskReturnDto[]
}

export class TaskDetailDto {
    @IsString()
    taskId: string
}