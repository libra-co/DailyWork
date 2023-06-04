/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-03 15:30:31
 * @LastEditors: liuhongbo 916196375@qq.com
 * @LastEditTime: 2023-06-05 00:53:01
 * @FilePath: \daily-work\src\user\user.service.ts
 * @Description: 
 */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/user.dto';
import { PrismaService } from 'src/prisima.service';
import { CommonResult } from 'src/types/common';

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

    async findOneUserByUsername(username: string): Promise<any | undefined> {

    }

    async findOneUserByEmail(email: string): Promise<any | undefined> {

    }
    async login(username: string, password: string): Promise<any | undefined> {
        console.log('username', username)
        console.log('password', password)
    }

    async findOneUserMixin(username: string): Promise<any | undefined> {
        let user
        user = await this.findOneUserByUsername(username)
        if (!user) {
            user = await this.findOneUserByEmail(username)
        }
    }
}
