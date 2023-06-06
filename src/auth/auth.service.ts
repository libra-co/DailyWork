/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-03 16:55:28
 * @LastEditors: liuhongbo 916196375@qq.com
 * @LastEditTime: 2023-06-07 00:49:49
 * @FilePath: \daily-work\src\auth\auth.service.ts
 * @Description: 登录模块
 */
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { User } from "@prisma/client";
import { UserService } from "src/user/user.service";
import { Request } from "express";
import { cookieConfig } from "./const";
import { CommonResult } from "src/types/common";
import { LoginDto } from "./dto/auth.dto";
@Injectable()
// PassportSerializer 用于序列化用户信息
export class AuthService {
  constructor(
    private readonly userService: UserService,
  ) { }


  async validateUser(username: string, password: string): Promise<User> {
    const validate = (user: User | null) => {
      if (user && user.password === password) {
        return user;
      }
      return null;
    }

    try {
      const validateUserResult = await this.userService.findOneUserByUsername(username);
      const user = validate(validateUserResult);
      if (user) {
        return validateUserResult;
      } else {
        const validateUserResult = await this.userService.findOneUserByEmail(username);
        const user = validate(validateUserResult);
        if (user) {
          return validateUserResult;
        }
      }
      return null;
    } catch (error) {
      console.log('error', error);
      throw new HttpException(
        '登录失败,服务器异常',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async login(loginDto: LoginDto, req: Request): Promise<CommonResult<any>> {
    const user = await this.validateUser(loginDto.username, loginDto.password)
    if (!user) {
      return {
        code: HttpStatus.UNAUTHORIZED,
        message: '用户名或密码错误',
        result: null
      }
    }
    const payload = { username: user.username, sub: user.uid };
    // req.res.cookie(cookieConfig.name, JSON.stringify(payload), cookieConfig.config)
    console.log('req.res.cookie',req.res.cookie(cookieConfig.name, JSON.stringify(payload), cookieConfig.config).header('cookie'))
    return {
      code: HttpStatus.OK,
      message: '登录成功',
      result: payload
    }
  }

  logout(req: Request) {
    req.res.clearCookie(cookieConfig.name, cookieConfig.config);
  }


}