import { IsArray, IsOptional, IsString } from "class-validator";

export class AddNotionDto {
    @IsString()
    title: string

    @IsString()
    projectId: string

    @IsOptional()
    @IsString()
    content: string
}

export class ListNotionDto {
    @IsString()
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
    @IsString()
    notionId: string

    @IsOptional()
    @IsString()
    title: string

    @IsOptional()
    @IsString()
    content: string
}

export class NotionDetailDto {
    @IsString()
    notionId: string
}
export class DeleteNotionDto {
    @IsString()
    notionId: string
}

export class OrderNotionDto {
    @IsArray()
    notionIds: string[]
}

export class ClearProjectNotionDto {
    @IsString()
    projectId: string
}