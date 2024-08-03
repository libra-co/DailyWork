/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-07-01 17:27:11
 * @LastEditors: liuhongbo 916196375@qq.com
 * @LastEditTime: 2023-07-01 19:01:48
 * @FilePath: \daily-work\src\redis\redis.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import * as IORedis from 'ioredis';
import { env } from 'process';

console.log('env.REDIS_HOST', env.REDIS_HOST);

export const redisConfig: IORedis.RedisOptions = {
  host: env.REDIS_HOST, // Redis 主机地址
  port: 6379, // Redis 端口号
  // password: '1391555202', // Redis 访问密码，若无密码请移除此行
  db: 0, // Redis 数据库编号
};
