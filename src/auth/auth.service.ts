/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-03 16:55:28
 * @LastEditors: liuhongbo liuhongbo@dip-ai.com
 * @LastEditTime: 2023-06-12 14:30:40
 * @FilePath: \daily-work\src\auth\auth.service.ts
 * @Description: 登录模块
 */
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
// PassportSerializer 用于序列化用户信息
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(username: string, password: string): Promise<User> {
    const validate = (user: User | null) => {
      if (user && user.password === password) {
        const { password, ...result } = user;
        return result;
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

  
  async login(user: User) {
    const payload = { username: user.username, sub: user.uid };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }



}