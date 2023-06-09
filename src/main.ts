/*
 * @Author: liuhongbo liuhongbo@dip-ai.com
 * @Date: 2023-06-08 15:15:06
 * @LastEditors: liuhongbo liuhongbo@dip-ai.com
 * @LastEditTime: 2023-06-09 16:24:01
 * @FilePath: /DailyWork/src/main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { cookieConfig } from './auth/const';
import { ValidateCookieMiddleware } from './middleware/validateCookie.middleware';
import { AuthService } from './auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const authService = app.get(AuthService)
  app.useGlobalPipes(new ValidationPipe());
  // cookieParser是一个中间件，用于解析cookie
  app.use(cookieParser(cookieConfig.secret, cookieConfig.config as any))
  app.use(new ValidateCookieMiddleware(authService).use)
  await app.listen(3000);
}
bootstrap();
