/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-03 14:30:12
 * @LastEditors: liuhongbo liuhongbo@dip-ai.com
 * @LastEditTime: 2023-06-12 16:56:53
 * @FilePath: \daily-work\src\app.module.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisima.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './auth/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwtAuthGuard.guard';
import { ProjectmangementModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { ColumnModule } from './column/column.module';

@Module({
  imports: [UserModule, AuthModule, ProjectmangementModule, TaskModule, ColumnModule],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },],
})
export class AppModule {

}
