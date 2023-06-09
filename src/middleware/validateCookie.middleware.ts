import { HttpException, HttpStatus, NestMiddleware, Injectable } from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "src/auth/auth.service";
import { cookieConfig } from "src/auth/const";
import { exceptCookieRouter } from "src/const";

@Injectable()
export class ValidateCookieMiddleware implements NestMiddleware {
    constructor(
        private readonly authService: AuthService
    ) { }
    async use(req, res, next) {
        const cookie = req.cookies[cookieConfig.name];
        if (cookie) {
            console.log('cookie', cookie)
            const decryptCookie = await this.authService.decryptCookie(cookie);
            const user = JSON.parse(decryptCookie);
            req.user = user;
        } else {
            // 排除不需要登录的路由
            if (!exceptCookieRouter.includes(req.url)) {
                console.log('req', req)
                console.log('req.baseUrl', req.baseUrl)
                console.log('req.baseUrl', req.url)
                // return '123'
                // throw new HttpException('请登录', HttpStatus.UNAUTHORIZED)
            }
        }
        next();
    }

    isExpired(cookie: string): boolean {
        // 从 cookie 中获取过期时间
        const [value, expires] = cookie.split('|');
        const expirationDate = new Date(expires);

        return expirationDate.getTime() <= Date.now();
    }

}