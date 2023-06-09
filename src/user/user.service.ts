/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-03 15:30:31
 * @LastEditors: liuhongbo liuhongbo@dip-ai.com
 * @LastEditTime: 2023-06-09 18:15:01
 * @FilePath: \daily-work\src\user\user.service.ts
 * @Description: 
 */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterDto, UpdateUserInfoDto } from './dto/user.dto';
import { PrismaService } from 'src/prisima.service';
import { CommonResult } from 'src/types/common';
import { User } from '@prisma/client';
import { Request } from 'express';

@Injectable()
export class UserService {
    constructor(
        private readonly prismaService: PrismaService
    ) { }

    // 检查邮箱是否已被用户注册
    async checkEmailIsExist(email: string): Promise<boolean> {
        try {
            const user = await this.prismaService.user.findUnique({
                where: { email }
            })
            return !!user
        } catch (error) {
            console.log('error', error)
            throw new HttpException('服务器异常,校验邮箱唯一性失败', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    // 注册
    async register(registerDto: RegisterDto): Promise<CommonResult> {
        // 检测邮箱是否存在
        const checkEmailIsExist = await this.checkEmailIsExist(registerDto.email)
        if (checkEmailIsExist) {
            return {
                code: HttpStatus.BAD_REQUEST,
                message: '邮箱已存在'
            }
        }

        try {
            const newUser = await this.prismaService.user.create({
                data: registerDto
            })
            if (newUser) {
                return {
                    code: HttpStatus.OK,
                    message: '注册成功'
                }
            }
            return {
                code: HttpStatus.BAD_REQUEST,
                message: '注册失败'
            }
        } catch (error) {
            console.log('error', error)
            console.log('error.meta', error.meta)
            throw new HttpException('服务器异常,注册失败', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async findOneUserByUserId(uid: string): Promise<User | undefined> {
        try {
            const user = await this.prismaService.user.findFirst({
                where: { uid }
            })
            return user
        } catch (error) {
            console.log('error', error)
            throw new Error('通过用户ID查询用户错误')
        }
    }
    async findOneUserByUsername(username: string): Promise<User | undefined> {
        try {
            const user = await this.prismaService.user.findFirst({
                where: { username }
            })
            return user
        } catch (error) {
            console.log('error', error)
            throw new Error('通过用户名查询用户错误')
        }
    }

    async findOneUserByEmail(email: string): Promise<User | undefined> {
        try {
            const user = await this.prismaService.user.findFirst({
                where: { email }
            })
            return user
        } catch (error) {
            console.log('error', error)
            throw new Error('通过邮箱查询用户错误')
        }
    }

    async updateUserInfo(updateUserInfoDto: UpdateUserInfoDto): Promise<CommonResult<User>> {
        const isUsernameExist = await this.findOneUserByUserId(updateUserInfoDto.username)
        if (!!isUsernameExist) {
            return {
                code: HttpStatus.BAD_REQUEST,
                message: '用户不存在',
                result: null
            }
        }
        try {
            const user = await this.prismaService.user.update({
                where: { uid: updateUserInfoDto.uid },
                data: updateUserInfoDto
            })
            return {
                code: HttpStatus.OK,
                message: '更新成功',
                result: user
            }
        } catch (error) {
            console.log('error', error)
            throw new HttpException('服务器异常,更新失败', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


}
