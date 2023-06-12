/*
 * @Author: liuhongbo liuhongbo@dip-ai.com
 * @Date: 2023-06-05 09:17:37
 * @LastEditors: liuhongbo liuhongbo@dip-ai.com
 * @LastEditTime: 2023-06-12 17:03:05
 * @FilePath: /DailyWork/src/user/user.controller.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto, UpdateUserInfoDto } from './dto/user.dto';
import { SkipAuth } from 'src/auth/skipAuth';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) { }

  @SkipAuth()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.userService.register(registerDto)
  }

  @Post('update')
  async update(@Body() updateUserInfoDto: UpdateUserInfoDto) {
    return this.userService.updateUserInfo(updateUserInfoDto)
  }

}
