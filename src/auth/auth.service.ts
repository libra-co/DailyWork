/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-03 16:55:28
 * @LastEditors: liuhongbo 916196375@qq.com
 * @LastEditTime: 2023-07-01 23:36:45
 * @FilePath: \daily-work\src\auth\auth.service.ts
 * @Description: 登录模块
 */
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
import { CommonResult } from "src/types/common";
import { RedisCacheProvider } from "src/redis/redis.cache.provider";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly redis: RedisCacheProvider
  ) { }

  async validateUser(username: string, password: string): Promise<User> {
    const validate = (user: User | null) => {
      if (user && user.password === password) {
        const { password, ...result } = user;
        return result;
      }
      throw new HttpException('登录失败,密码错误', HttpStatus.BAD_REQUEST);
    }

    const validateUserResult = await this.userService.findOneUserByUsername(username);
    if (!validateUserResult) {
      throw new HttpException(
        '登录失败,用户不存在',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
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

  }


  async login(user: User): Promise<CommonResult<{ token: string }>> {
    const payload = { username: user.username, sub: user.uid };

    return {
      code: HttpStatus.OK,
      message: '登录成功',
      result: { token: this.jwtService.sign(payload) }
    };
  }

  async loginPicCode(): Promise<CommonResult<{ urlCode: string }>> {
    try {
      const loginPicCode = await this.redis.get('loginImage');
      return {
        code: HttpStatus.OK,
        message: '获取成功',
        result: {
          urlCode: loginPicCode
        }
      };
    } catch (error) {
      console.log('error', error)
    }
  }

}