/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-03 15:06:37
 * @LastEditors: liuhongbo 916196375@qq.com
 * @LastEditTime: 2023-06-03 15:09:10
 * @FilePath: \daily-work\src\prisima.service.ts
 * @Description:
 */
import {
  INestApplication,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super();
  }
  async onModuleInit() {
    await this.$connect();
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
  async enableShutdownHooks(app: INestApplication) {
    // TODO 这里的类型断言是因为没有找到更好的方法
    (this.$on as any)('beforeExit', async () => {
      await app.close();
    });
  }
}
