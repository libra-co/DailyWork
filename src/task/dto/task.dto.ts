/*
 * @Author: liuhongbo liuhongbo@dip-ai.com
 * @Date: 2023-06-14 15:54:22
 * @LastEditors: liuhongbo liuhongbo@dip-ai.com
 * @LastEditTime: 2023-06-14 16:16:43
 * @FilePath: /DailyWork/src/task/dto/task.dto.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";
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
    parentTaskId?: string

    @IsOptional()
    @IsString()
    description?: string
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