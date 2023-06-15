/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-03 16:55:28
 * @LastEditors: liuhongbo liuhongbo@dip-ai.com
 * @LastEditTime: 2023-06-13 11:41:16
 * @FilePath: \daily-work\src\auth\auth.service.ts
 * @Description: 登录模块
 */
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
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


  async login(user: User) {
    const payload = { username: user.username, sub: user.uid };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }



}