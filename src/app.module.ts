/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-03 14:30:12
 * @LastEditors: liuhongbo 916196375@qq.com
 * @LastEditTime: 2023-06-04 23:32:42
 * @FilePath: \daily-work\src\app.module.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisima.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule { }
