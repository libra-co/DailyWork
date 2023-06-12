/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-03 17:26:17
 * @LastEditors: liuhongbo liuhongbo@dip-ai.com
 * @LastEditTime: 2023-06-12 14:45:51
 * @FilePath: \daily-work\src\auth\local.strategy.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { User } from "@prisma/client";
import { Strategy } from "passport-local";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(private authService: AuthService) {
        super()
    }
    async validate(username: string, password: string): Promise<Omit<User, 'password'>> {
        const user = await this.authService.validateUser(username, password)
        if (!user) {
            throw new UnauthorizedException()
        }
        return user;
    }
}