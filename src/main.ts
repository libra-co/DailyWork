/*
 * @Author: liuhongbo liuhongbo@dip-ai.com
 * @Date: 2023-06-08 15:15:06
 * @LastEditors: liuhongbo 916196375@qq.com
 * @LastEditTime: 2023-07-01 22:15:10
 * @FilePath: /DailyWork/src/main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import Redis from 'ioredis';
import { redisConfig } from './redis/redis.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3101);
}
bootstrap();
