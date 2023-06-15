/*
 * @Author: liuhongbo liuhongbo@dip-ai.com
 * @Date: 2023-06-12 18:08:40
 * @LastEditors: liuhongbo liuhongbo@dip-ai.com
 * @LastEditTime: 2023-06-14 15:52:17
 * @FilePath: /DailyWork/src/project/const.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export enum ProjectStatusEnum {
    NotStarted = 0,
    InProgress = 1,
    Completed = 2,
    Delayed = 3,
    Suspended = 4, // 暂停
    Aborted = 5, // 终止
}