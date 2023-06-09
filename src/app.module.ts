/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-03 14:30:12
 * @LastEditors: liuhongbo liuhongbo@dip-ai.com
 * @LastEditTime: 2023-06-09 16:39:42
 * @FilePath: \daily-work\src\app.module.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisima.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ValidateCookieMiddleware } from './middleware/validateCookie.middleware';

@Module({
  imports: [UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule  {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(ValidateCookieMiddleware).exclude(excludeRoutr.toString()).forRoutes('*') // 校验cookie
  // }
}
