/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-03 16:55:28
 * @LastEditors: liuhongbo 916196375@qq.com
 * @LastEditTime: 2023-06-04 20:46:03
 * @FilePath: \daily-work\src\auth\auth.service.ts
 * @Description: 登录模块
 */
import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { UserService } from "src/user/user.service";

@Injectable()
// PassportSerializer 用于序列化用户信息
export class AuthService extends PassportSerializer {
  constructor(
    private userService: UserService,
  ) {
    super();
  }
  
  serializeUser(user: any, done: (err: Error, payload: string) => void) {
    done(null, user);
  }

  async deserializeUser(payload: any, done: (err: Error, payload: string) => void) {
    const user = await this.userService.findOneUserByUsername(payload.username);
    return done(null, user);
  }

  async validateUser(username: string, password: string): Promise<any> {
    const validate = (user: any | null) => {
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
}