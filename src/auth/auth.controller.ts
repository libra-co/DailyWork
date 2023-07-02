/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-04 19:53:06
 * @LastEditors: liuhongbo 916196375@qq.com
 * @LastEditTime: 2023-07-01 23:47:30
 * @FilePath: \daily-work\src\auth\auth.controller.ts
 * @Description: 
 */
import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { SkipAuth } from './skipAuth';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @SkipAuth()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @SkipAuth()
  @Get('loginPic')
  async loginPic() {
    return this.authService.loginPicCode();
  }
}
