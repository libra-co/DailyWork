/*
 * @Author: liuhongbo liuhongbo@dip-ai.com
 * @Date: 2023-06-28 14:39:58
 * @LastEditors: liuhongbo liuhongbo@dip-ai.com
 * @LastEditTime: 2023-06-30 18:37:53
 * @FilePath: /DailyWork/src/notion/notion.service.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisima.service';
import { AddNotionDto, ClearProjectNotionDto, DeleteNotionDto, ListNotionDto, ListNotionReturnDto, NotionDetailDto, OrderNotionDto, UpdateNotionDto } from './dto/notion.dto';
import { CommonResult } from 'src/types/common';
import { Notion, User } from '@prisma/client';
import { formatTimeToShanghai } from 'src/utils/timeUtils';

@Injectable()
export class NotionService {
    constructor(
        private readonly prismaService: PrismaService,
    ) { }

    async add(user: User, addNotionDto: AddNotionDto): Promise<CommonResult> {
        try {
            const notionNum = await this.prismaService.notion.count({
                where: { projectId: addNotionDto.projectId }
            })
            const addNotionData = { ...addNotionDto, order: notionNum, creatorId: user.uid }
            const newNotion = await this.prismaService.notion.create({
                data: addNotionData
            })
            if (!newNotion) {
                return {
                    code: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: '内部错误，添加失败！',
                    result: null
                }
            }
            return {
                code: HttpStatus.OK,
                message: '添加成功！',
                result: null
            }
        } catch (error) {
            console.log('error', error)
            return {
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                message: '内部错误，添加失败！',
                result: null
            }
        }
    }

    async list(listNotionDto: ListNotionDto): Promise<CommonResult<ListNotionReturnDto[]>> {
        try {
            const notions = await this.prismaService.notion.findMany({
                where: { projectId: listNotionDto.projectId },
                orderBy: { order: 'asc' },
                select: {
                    notionId: true,
                    order: true,
                    title: true,
                    content: true,
                    updateTime: true,
                }
            })
            if (!notions) {
                return {
                    code: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: '内部错误，查询失败！',
                    result: null
                }
            }
            const formatNotions = notions.map(notion => formatTimeToShanghai(notion))
            return {
                code: HttpStatus.OK,
                message: '查询成功！',
                result: formatNotions
            }
        } catch (error) {
            console.log('error', error)
            return {
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                message: '内部错误，查询失败！',
                result: null
            }
        }
    }

    async update(updateNotionDto: UpdateNotionDto): Promise<CommonResult> {
        try {
            const updateNotion = await this.prismaService.notion.update({
                where: { notionId: updateNotionDto.notionId },
                data: updateNotionDto
            })
            if (!updateNotion) {
                return {
                    code: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: '内部错误，更新失败！',
                    result: null
                }
            }
            return {
                code: HttpStatus.OK,
                message: '更新成功！',
                result: null
            }
        } catch (error) {
            console.log('error', error)
            return {
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                message: '内部错误，更新失败！',
                result: null
            }
        }
    }

    async detail(notionDetailDto: NotionDetailDto): Promise<CommonResult<Notion>> {
        try {
            const notion = await this.prismaService.notion.findUnique({
                where: { notionId: notionDetailDto.notionId },
                select: {
                    notionId: true,
                    title: true,
                    content: true,
                    updateTime: true,
                }
            })
            const detailResult = formatTimeToShanghai(notion) as Notion
            return {
                code: HttpStatus.OK,
                message: '查询成功',
                result: detailResult
            }
        } catch (error) {
            console.log('error', error)
            return {
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                message: '内部错误，查询失败',
                result: null
            }
        }
    }

    async delete(deleteNotionDto: DeleteNotionDto): Promise<CommonResult> {
        const currentNotion = await this.prismaService.notion.findUnique({
            where: { notionId: deleteNotionDto.notionId }
        })
        if (!currentNotion) {
            return {
                code: HttpStatus.NOT_FOUND,
                message: '删除失败，便签未找到！',
                result: null
            }
        }
        try {
            await this.prismaService.notion.delete({
                where: { notionId: deleteNotionDto.notionId }
            })
            // 排序
            const notions = await this.prismaService.notion.findMany({
                where: { projectId: currentNotion.projectId },
                select: { notionId: true },
                orderBy: { order: 'asc' }
            })
            const notionIds = notions.reduce((pre, cur) => {
                pre.notionIds.push(cur.notionId)
                return pre
            }, { notionIds: [] as string[] })
            this.order(notionIds)
            return {
                code: HttpStatus.OK,
                message: '删除成功！',
                result: null
            }
        } catch (error) {
            console.log('error', error)
            return {
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                message: '内部错误，删除失败！',
                result: null
            }
        }
    }

    async order(orderNotionDto: OrderNotionDto): Promise<CommonResult> {
        try {
            await this.prismaService.$transaction(async (prisma) => {
                await Promise.all(
                    orderNotionDto.notionIds.map(async (notionId, index) => {

                        await prisma.notion.update({
                            where: { notionId: notionId },
                            data: { order: index }
                        })
                        await prisma.notion.findMany({
                            where: { projectId: "6282d04c-e187-4c93-9bc4-cdd609cd4e19" },
                        })
                    }
                    )
                )
            })
            return {
                code: HttpStatus.OK,
                message: '排序成功！',
                result: null
            }
        } catch (error) {
            console.log('error', error)
            return {
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                message: '内部错误，排序失败！',
                result: null
            }
        }
    }

    async clearProjectNotion(clearProjectNotionDto: ClearProjectNotionDto): Promise<CommonResult> {
        try {
            await this.prismaService.notion.deleteMany({
                where: { projectId: clearProjectNotionDto.projectId }
            })
            return {
                code: HttpStatus.OK,
                message: '清空成功！',
                result: null
            }
        } catch (error) {
            console.log('error', error)
            return {
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                message: '内部错误，清空失败！',
                result: null
            }
        }
    }
}
