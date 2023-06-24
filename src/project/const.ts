/*
 * @Author: liuhongbo liuhongbo@dip-ai.com
 * @Date: 2023-06-12 18:08:40
 * @LastEditors: liuhongbo 916196375@qq.com
 * @LastEditTime: 2023-06-24 20:07:28
 * @FilePath: /DailyWork/src/project/const.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export enum ProjectStatusEnum {
    NotStarted = 0, // 未开始
    InProgress = 1, // 进行中
    Completed = 2, // 已完成
    Delayed = 3, // 延期
    Suspended = 4, // 暂停
    Aborted = 5, // 终止
}