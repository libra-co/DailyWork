/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-04 19:53:06
 * @LastEditors: liuhongbo 916196375@qq.com
 * @LastEditTime: 2023-06-06 00:37:03
 * @FilePath: \daily-work\src\auth\auth.controller.ts
 * @Description: 
 */
import { Body, Controller, HttpException, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { cookieConfig } from './const';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  // @UseGuards(AuthGuard('local'))
  async login(@Req() req: Request, @Body() body: any): Promise<any | undefined> {
    const token = Buffer.from(`${body.username}:${body.password}`).toString('base64');
    return req.res.cookie(cookieConfig.cookieName, token, cookieConfig.cookie);
  }
}
