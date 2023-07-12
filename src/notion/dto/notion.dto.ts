import { IsArray, IsOptional, IsString } from "class-validator";

export class AddNotionDto {
    @IsString({message:'标题不能为空！'})
    title: string

    @IsString({message:'projectId不能为空！'})
    projectId: string

    @IsOptional()
    @IsString({message:'content必须为字符串！'})
    content: string
}

export class ListNotionDto {
    @IsString({message:'projectId不能为空！'})
    projectId: string
}

export interface ListNotionReturnDto {
    notionId: string,
    projectId: string,
    title: string,
    content: string,
    order: number,
    updateTime: string,
}

export class UpdateNotionDto {
    @IsString({message:'notionId不能为空！'})
    notionId: string

    @IsOptional()
    @IsString({message:'title必须为字符串！'})
    title: string

    @IsOptional()
    @IsString({message:'content必须为字符串！'})
    content: string
}

export class NotionDetailDto {
    @IsString({message:'notionId不能为空！'})
    notionId: string
}
export class DeleteNotionDto {
    @IsString({message:'notionId不能为空！'})
    notionId: string
}

export class OrderNotionDto {
    @IsArray({message:'notionIds必须为数组！'})
    notionIds: string[]
}

export class ClearProjectNotionDto {
    @IsString({message:'projectId不能为空！'})
    projectId: string
}