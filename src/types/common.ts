import { HttpStatus } from "@nestjs/common";

export interface CommonResult<result = null> {
    code: HttpStatus;
    message: string;
    result?: result;
}