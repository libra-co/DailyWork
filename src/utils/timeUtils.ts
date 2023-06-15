/*
 * @Author: liuhongbo liuhongbo@dip-ai.com
 * @Date: 2023-06-14 09:38:03
 * @LastEditors: liuhongbo liuhongbo@dip-ai.com
 * @LastEditTime: 2023-06-14 16:52:57
 * @FilePath: /DailyWork/src/utils/timeUtils.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { HttpException, HttpStatus } from "@nestjs/common";

const momentTimezone = require('moment-timezone')

const timezone = 'Asia/Shanghai'
const format = 'YYYY-MM-DD HH:mm:ss'
const ymdhmsPattern = /^\d{4}-\d{2}-\d{2}( \d{2}:\d{2}:\d{2})?$/;


/**
 * @description: 格式化时间为上海时间
 * @param time 可以为对象，字符串，Date类型
 */
export const formatTimeToShanghai = (time: any) => {
    const date = '[object Date]'
    const object = '[object Object]'
    const timeType = Object.prototype.toString.call(time)
    if (timeType === date) {
        return momentTimezone(time).tz(timezone).format(format)
    }
    if (timeType === object) {
        for (const key in time as Object) {
            if (Object.prototype.hasOwnProperty.call(time, key)) {
                if (!key.toLocaleLowerCase().includes('name')) {
                    time[key] = formatTimeToShanghai(time[key])
                }
            }
        }
        return time
    }
    return time
}

/**
 * @description: 格式化时间为 UTC 时间
 * @param time 可以为对象，字符串，Date类型
 */
export const formatTimeToUtc = (time: any) => {
    const date = '[object Date]'
    const string = '[object String]'
    const object = '[object Object]'
    const timeType = Object.prototype.toString.call(time)
    const isTimeFormat = (time: string) => ymdhmsPattern.test(time)
    const isValidate = isTimeFormat(time)
    if (isValidate) {
        if (timeType === date) {
            return momentTimezone(time).utc().toDate()
        }
        if (timeType === string) {
            return momentTimezone(time).utc().toDate()
        }
    }

    if (timeType === object) {
        for (const key in time as Object) {
            if (Object.prototype.hasOwnProperty.call(time, key)) {
                if (!key.toLocaleLowerCase().includes('name') || !key.includes('Name')) {
                    time[key] = formatTimeToUtc(time[key])
                }
            }
        }
        return time
    }
    return time
}

// 检查项目结束时间是否大于开始时间
export const checkFinishTimeIsOverStartTime = (startTime: string, finishTime: string) => {
    if (startTime > finishTime) {
        throw new HttpException('结束时间不能小于开始时间', HttpStatus.BAD_REQUEST)
    }
}
