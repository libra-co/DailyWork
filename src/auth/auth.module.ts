/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-03 16:54:08
 * @LastEditors: liuhongbo liuhongbo@dip-ai.com
 * @LastEditTime: 2023-06-12 14:34:25
 * @FilePath: \daily-work\src\auth\auth.module.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Module, NestModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisima.service';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from './const';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: jwtConfig.secret,
            signOptions: jwtConfig.options
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, UserService, PrismaService, LocalStrategy],
    exports: [AuthService]
})
export class AuthModule { }
