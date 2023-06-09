/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-03 16:55:28
 * @LastEditors: liuhongbo liuhongbo@dip-ai.com
 * @LastEditTime: 2023-06-09 17:37:23
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
import { Response } from "express"
const crypto = require('crypto');

@Injectable()
// PassportSerializer 用于序列化用户信息
export class AuthService {
  constructor(
    private readonly userService: UserService,
  ) { }

  // 加密cookie
  async encryptCookie(cookie: string) {
    try {
      const iv = Buffer.from(crypto.randomBytes(16), 'hex');
      const cipher = crypto.createCipheriv(cookieConfig.algorithm, cookieConfig.encryptoKey, cookieConfig.encryptoIv);

      let encrypted = cipher.update(cookie);
      encrypted = Buffer.concat([encrypted, cipher.final()]);

      return `${iv.toString('hex')}.${encrypted.toString('hex')}`;

    } catch (error) {
      console.log('error', error)
    }
  }

  // 解密cookie
  async decryptCookie(cookie: string) {
    const [ivHex, encryptedHex] = cookie.split('.');
    const iv = Buffer.from(ivHex, 'hex');
    const encrypted = Buffer.from(encryptedHex, 'hex');
    const decipher = crypto.createDecipheriv(cookieConfig.algorithm, cookieConfig.encryptoKey, cookieConfig.encryptoIv);
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
  }

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

  async login(loginDto: LoginDto, res: Response): Promise<CommonResult<any>> {
    const user = await this.validateUser(loginDto.username, loginDto.password)
    if (!user) {
      return {
        code: HttpStatus.UNAUTHORIZED,
        message: '用户名或密码错误',
        result: null
      }
    }
    const payload = { username: user.username, sub: user.uid };
    res.cookie(cookieConfig.name, this.encryptCookie(user.username), cookieConfig.config as any)
    return {
      code: HttpStatus.OK,
      message: '登录成功',
      result: payload
    }
  }

  logout(req: Request) {
    req.res.clearCookie(cookieConfig.name, cookieConfig.config as any);
  }


}