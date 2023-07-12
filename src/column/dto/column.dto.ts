import { IsInt, IsOptional, IsString } from "class-validator"

/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-16 21:17:01
 * @LastEditors: liuhongbo liuhongbo@dip-ai.com
 * @LastEditTime: 2023-07-11 13:48:54
 * @FilePath: \daily-work\src\column\dto\column.dto.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export class AddColumnDto {
    @IsString({message: 'projectId不能为空！',})
    projectId: string

    @IsString({message:'列名不能为空！'})
    columnName: string
}

export class UpdateColumnDto {
    @IsString({message:'columnId不能为空！'})
    columnId: string

    @IsOptional()
    @IsString({message:'columnName必须为字符串！'})
    columnName: string

    @IsOptional()
    @IsInt({message:'order必须为数字'})
    order: number
}

export class DeleteColumnDto {
    @IsString({message:'columnId不能为空！'})
    columnId: string
}
export class ColumnListDto {
    @IsString({message:'projectId不能为空'})
    projectId: string
}

