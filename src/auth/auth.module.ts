/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-03 16:54:08
 * @LastEditors: liuhongbo liuhongbo@dip-ai.com
 * @LastEditTime: 2023-06-09 16:21:27
 * @FilePath: \daily-work\src\auth\auth.module.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { cookieConfig } from './const';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisima.service';
import { LocalStrategy } from './local.strategy';

@Module({
    controllers: [AuthController],
    providers: [AuthService, UserService, PrismaService],
    exports: [AuthService]
})
export class AuthModule { }
