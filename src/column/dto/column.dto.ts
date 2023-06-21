import { IsInt, IsOptional, IsString } from "class-validator"

/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-16 21:17:01
 * @LastEditors: liuhongbo 916196375@qq.com
 * @LastEditTime: 2023-06-17 14:13:36
 * @FilePath: \daily-work\src\column\dto\column.dto.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export class AddColumnDto {
    @IsString()
    projectId: string

    @IsString()
    columnName: string
}

export class UpdateColumnDto {
    @IsString()
    columnId: string
    @IsOptional()
    @IsString()
    columnName: string

    @IsOptional()
    @IsInt()
    order: number
}

export class DeleteColumnDto {
    @IsString()
    columnId: string
}
export class ColumnListDto {
    @IsString()
    projectId: string
}

