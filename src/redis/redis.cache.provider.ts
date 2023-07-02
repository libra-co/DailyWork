/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-07-01 17:29:18
 * @LastEditors: liuhongbo 916196375@qq.com
 * @LastEditTime: 2023-07-01 23:48:02
 * @FilePath: \daily-work\src\redis\redis.cache.provider.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { redisConfig } from './redis.config';

@Injectable()
export class RedisCacheProvider {
  private redis: Redis;

  constructor() {
    this.redis = new Redis(redisConfig);
  }

  async get(key: string): Promise<string> {
    try {
      return await this.redis.get(key);
    } catch (error) {
      throw new Error(`获取值时出错：${error.message}`);
    }
  }

  async set(key: string, value: string): Promise<void> {
    try {
      await this.redis.set(key, value);
    } catch (error) {
      throw new Error(`设置值时出错：${error.message}`);
    }
  }

  async setWithExpiration(key: string, value: string, seconds: number): Promise<void> {
    try {
      await this.redis.setex(key, seconds, value);
    } catch (error) {
      throw new Error(`设置值时出错：${error.message}`);
    }
  }

  async delete(key: string): Promise<number> {
    try {
      return await this.redis.del(key);
    } catch (error) {
      throw new Error(`删除键时出错：${error.message}`);
    }
  }
}
