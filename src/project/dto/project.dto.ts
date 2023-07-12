/*
 * @Author: liuhongbo liuhongbo@dip-ai.com
 * @Date: 2023-06-12 17:58:06
 * @LastEditors: liuhongbo liuhongbo@dip-ai.com
 * @LastEditTime: 2023-06-25 15:16:48
 * @FilePath: /DailyWork/src/projectList/dto/projectList.dto.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE   
 */
import { IsArray, IsDateString, IsOptional, IsString } from "class-validator";
import { ProjectStatusEnum } from "../const";

export class AddProjectDto {
    @IsString({message:'项目名称不能为空！'})
    projectName: string

    @IsOptional()
    @IsDateString()
    startTime?: string

    @IsOptional()
    @IsDateString()
    finishTime?: string

    @IsOptional()
    @IsString({message:'项目描述必须为字符串！'})
    description?: string

    @IsOptional()
    @IsString({message:'notion必须为字符串！'})
    notion?: string
}

export class DeleteProjectDto {
    @IsString({message:'projectId不能为空！'})
    projectId: string
}

export class UpdateProjectDto {
    @IsString()
    projectId: string

    @IsString()
    @IsOptional()
    projectName?: string

    @IsOptional()
    @IsString()
    startTime?: string

    @IsOptional()
    @IsString()
    finishTime?: string

    @IsOptional()
    @IsString()
    status?: ProjectStatusEnum

    @IsOptional()
    @IsString()
    description?: string

    @IsOptional()
    @IsString()
    notion?: string
}

export class OrderProjectDto {
    @IsArray()
    projectIds: string[]
}

export class ProjectDetailDto {
    @IsString()
    projectId: string
}