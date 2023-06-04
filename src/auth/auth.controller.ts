/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-04 19:53:06
 * @LastEditors: liuhongbo 916196375@qq.com
 * @LastEditTime: 2023-06-04 20:55:08
 * @FilePath: \daily-work\src\auth\auth.controller.ts
 * @Description: 
 */
import { Controller, HttpException, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: Request): Promise<any | undefined> {
    return req.user
  }

}
