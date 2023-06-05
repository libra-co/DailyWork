/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-03 16:55:28
 * @LastEditors: liuhongbo 916196375@qq.com
 * @LastEditTime: 2023-06-06 00:03:40
 * @FilePath: \daily-work\src\auth\auth.service.ts
 * @Description: 登录模块
 */
import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { User } from "@prisma/client";
import { UserService } from "src/user/user.service";
import { Request } from "express";
import { cookieConfig } from "./const";
@Injectable()
// PassportSerializer 用于序列化用户信息
export class AuthService {
  constructor(
    private userService: UserService,
  ) { }


  async validateUser(username: string, password: string): Promise<User> {
    const validate = (user: User | null) => {
      if (user && user.password === password) {
        return user;
      }
      return null;
    }
    const validateUserFns = [this.userService.findOneUserByUsername, this.userService.findOneUserByEmail]
    let loginedUser
    validateUserFns.some(async fn => {
      const validateUserResult = await fn(username)
      const user = validate(validateUserResult)
      if (user) {
        loginedUser = validateUserResult
      }
      return user
    })
    return loginedUser || null
  }

  async login(user: User, req: Request) {

  }

  logout(req: Request) {
    req.res.clearCookie('auth_token');
  }


}