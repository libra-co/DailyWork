/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-16 21:03:03
 * @LastEditors: liuhongbo 916196375@qq.com
 * @LastEditTime: 2023-06-22 17:44:31
 * @FilePath: \daily-work\src\column\column.service.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisima.service';
import { AddColumnDto, ColumnListDto, DeleteColumnDto, UpdateColumnDto } from './dto/column.dto';
import { Column } from '@prisma/client';
import { CommonResult } from 'src/types/common';

@Injectable()
export class ColumnService {
    constructor(
        private readonly prismaService: PrismaService,
    ) { }

    async add(addColumnDto: AddColumnDto): Promise<Column> {
        const projectColumns = await this.prismaService.column.findMany({
            where: {
                projectId: addColumnDto.projectId
            }
        })
        const column = await this.prismaService.column.create({
            data: {
                ...addColumnDto,
                order: projectColumns.length
            }
        })
        if (!column) {
            throw new HttpException('内部错误，新增列失败！', HttpStatus.INTERNAL_SERVER_ERROR)
        }
        return column
    }

    async update(updateColumnDto: UpdateColumnDto): Promise<Column> {
        const updatedColumn = await this.prismaService.column.update({
            where: { columnId: updateColumnDto.columnId },
            data: updateColumnDto
        })
        if (!updatedColumn) {
            throw new HttpException('内部错误，更新列失败！', HttpStatus.INTERNAL_SERVER_ERROR)
        }
        return updatedColumn
    }

    async delete(deleteColumnDto: DeleteColumnDto): Promise<Column> {
        const updatedColumn = await this.prismaService.column.delete({
            where: { columnId: deleteColumnDto.columnId },
        })
        if (!updatedColumn) {
            throw new HttpException('内部错误，删除列失败！', HttpStatus.INTERNAL_SERVER_ERROR)
        }
        return updatedColumn
    }

    async list(columnListDto: ColumnListDto): Promise<CommonResult<Column[]>> {
        const columns = await this.prismaService.column.findMany({
            where: {
                projectId: columnListDto.projectId
            },
            orderBy: {
                order: 'asc'
            }
        })
        if (!columns) {
            throw new HttpException('内部错误，查询列失败！', HttpStatus.INTERNAL_SERVER_ERROR)
        }
        return {
            code: 200,
            message: '查询成功',
            result: columns
        }
    }

    // 检查并删除空列
    async checkAndDeleteEmptyColumn(projectId: string, columnId?: string): Promise<CommonResult> {
        if (!columnId) {
            const columns = await this.prismaService.column.findMany({
                where: {
                    projectId
                }
            })
            if (columns.length === 0) {
                return {
                    code: HttpStatus.OK,
                    message: '删除成功',
                    result: null
                }
            } else {
                Promise.all(columns.map(async (column) => {
                    const isEmptyColumn = await this.prismaService.task.findFirst({
                        where: { columnId: column.columnId }
                    })
                    if (!isEmptyColumn) {
                        await this.prismaService.column.delete({
                            where: { columnId: column.columnId }
                        })
                    }
                }
                ))
            }
        }
        try {
            const isEmptyColumn = await this.prismaService.task.findFirst({
                where: { columnId }
            })
            if (!isEmptyColumn) {
                await this.prismaService.column.delete({
                    where: { columnId }
                })
                return {
                    code: HttpStatus.OK,
                    message: '删除成功',
                    result: null
                }
            }
            return {
                code: HttpStatus.OK,
                message: '列下有任务，不可删除',
                result: null
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    async clearProjectColumn(projectId: string): Promise<CommonResult> {
        try {
            const result = await this.prismaService.column.deleteMany({
                where: { projectId }
            })
            return {
                code: HttpStatus.OK,
                message: '项目列清空成功！',
                result: null
            }
        } catch (error) {
            console.log('error', error)
            return {
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                message: '内部错误,项目列清空失败！',
                result: null
            }
        }
    }
}
