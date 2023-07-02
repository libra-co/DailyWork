/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-07-01 22:49:53
 * @LastEditors: liuhongbo 916196375@qq.com
 * @LastEditTime: 2023-07-02 20:50:09
 * @FilePath: \daily-work\src\scheduleTask\scheduleTask.service.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { RedisCacheProvider } from 'src/redis/redis.cache.provider';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TinyPngRes, shrinkPnkUrl, tinyPngApiKey } from './const';

@Injectable()
export class ScheduleTaskService {
    constructor(private readonly redis: RedisCacheProvider) { }

    @Cron(CronExpression.EVERY_3_HOURS)
    async getLoginImage() {
        try {
            const currentImgCode = await this.redis.get('loginImage')
            if (currentImgCode) return null

            // 请求图片地址
            const { data: { url: imgUrl } } = await axios.get('https://api.vvhan.com/api/moyu?type=json')
            // 请求tinypng,压缩图片
            const { output: { url: shrinkImgUrl } } = await axios.post(shrinkPnkUrl,
                {
                    "source": {
                        "url": imgUrl
                    },
                },
                {
                    headers: {
                        Authorization: `Basic ${Buffer.from(`api:${tinyPngApiKey}`).toString("base64")}`,
                        "Content-Type": "application/json",
                    },
                },
            ) as TinyPngRes

            // 请求图片,转为base64
            const res = await axios.get(shrinkImgUrl, {
                responseType: 'arraybuffer'
            })
            const imgBuffer = Buffer.from(res.data, 'binary').toString('base64')
            // 设置图片过期时间
            const currentTimestamp = Math.floor(Date.now() / 1000);
            const secondsInDay = 24 * 60 * 60;
            const secondsUntilEndOfDay = secondsInDay - (currentTimestamp % secondsInDay);
            await this.deleteLoginImg()
            await this.redis.setWithExpiration('loginImage', imgBuffer, secondsUntilEndOfDay)

        } catch (error) {
            console.log('获取图片出错', error)
        }
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async deleteLoginImg() {
        await this.redis.delete('loginImage')
    }
}