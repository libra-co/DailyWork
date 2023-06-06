/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-04 19:53:06
 * @LastEditors: liuhongbo 916196375@qq.com
 * @LastEditTime: 2023-06-06 23:27:47
 * @FilePath: \daily-work\src\auth\auth.controller.ts
 * @Description: 
 */
import { Body, Controller, HttpException, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { cookieConfig } from './const';
import { LoginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  // @UseGuards(AuthGuard('local'))
  async login(@Req() req: Request, @Body() loginDto: LoginDto) {
    return this.authService.login(loginDto, req)
  }
}
