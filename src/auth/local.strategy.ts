/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-03 17:26:17
 * @LastEditors: liuhongbo 916196375@qq.com
 * @LastEditTime: 2023-06-06 00:05:15
 * @FilePath: \daily-work\src\auth\local.strategy.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-cookie';
import { AuthService } from "./auth.service";
import { Request } from 'express';
import { cookieConfig } from "./const";
import { User } from "@prisma/client";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(private authService: AuthService) {
        super()
    }
    async validate(username: string, password: string): Promise<Omit<User, 'password'>> {
        const user = await this.authService.validateUser(username, password)
        if (!user) {
            return null
        }
        const { password: psw, ...rest } = user
        return rest;
    }
}