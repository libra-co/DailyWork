import exp from "constants"

// 请求该地址,活期摸鱼报图片url
export const toushfishingUrl = 'https://api.vvhan.com/api/moyu?type=json'
export const shrinkPnkUrl = 'https://api.tinify.com/shrink'
export const tinyPngApiKey = 'VwzhN6SLWyz8pK2y2jWDcZM0hXFLMDNy'

export interface TinyPngRes {
    input: Input;
    output: Output;
}

interface Output {
    size: number;
    type: string;
    width: number;
    height: number;
    ratio: number;
    url: string;
}

interface Input {
    size: number;
    type: string;
}