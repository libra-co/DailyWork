/*
 * @Author: liuhongbo liuhongbo@dip-ai.com
 * @Date: 2023-06-05 09:17:37
 * @LastEditors: liuhongbo liuhongbo@dip-ai.com
 * @LastEditTime: 2023-06-25 17:42:07
 * @FilePath: /DailyWork/src/app.service.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Injectable } from '@nestjs/common';
import { SkipAuth } from './auth/skipAuth';

@SkipAuth()
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello Daily Work!';
  }
}
