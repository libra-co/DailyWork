/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-04 20:12:25
 * @LastEditors: liuhongbo 916196375@qq.com
 * @LastEditTime: 2023-06-05 23:30:21
 * @FilePath: \daily-work\src\auth\const.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// cookie的配置项
export const cookieConfig = {
    cookieName: 'token',
    secret: 'createdByLibraForDailyWorkSercet',
    saveUninitialized: false,
    resave: false,
    cookie: {
        signed: true,
        maxAge: 1000 * 60 * 60 * 1 * 1,
    }
}