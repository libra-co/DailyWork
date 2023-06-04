import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { cookieConfig } from './const';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisima.service';

@Module({
    controllers: [AuthController],
    providers: [AuthService, UserService, PrismaService]
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.
            apply(cookieParser(), session(cookieConfig))
            .forRoutes('*')
    }
}
