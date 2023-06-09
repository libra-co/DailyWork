/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-04 20:12:25
 * @LastEditors: liuhongbo liuhongbo@dip-ai.com
 * @LastEditTime: 2023-06-09 17:35:44
 * @FilePath: \daily-work\src\auth\const.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { CookieParseOptions } from "cookie-parser";

// cookie的配置项
export const cookieConfig = {
    name: 'token',
    secret: 'createdByLibraForDailyWorkSercet',
    encryptoKey: 'createdByLibraForDailyWorkCookie', // 加密cookie的key
    encryptoIv: 'dailyWorkSaltByL', // 加密cookie的iv
    algorithm: 'aes-256-cbc', // 加密算法
    config: {
        maxAge: 1000 * 60 * 60 * 1, // 过期时间为 1 小时
        httpOnly: true, // 设置为 true，表示无法通过 JS 访问 cookie，降低 XSS 攻击风险
        secure: true, // 如果你的应用启用了 HTTPS，设置为 true，提高安全性
        path: '/', // cookie 所在的路径，通常设为根路径，以便整个网站都能访问这个 cookie
        sameSite: 'none' // 防止 CSRF 攻击，sameSite 属性可以设置为 Strict、Lax 或 None，具体可以参考相关资料，此处设置为 none    }
    }
} 
