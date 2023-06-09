import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { Gender } from "../const";

export class RegisterDto {
    @IsString()
    @IsNotEmpty({ message: '用户名不能为空' })
    readonly username: string;

    @IsEmail({}, { message: '邮箱格式不正确' })
    @IsNotEmpty({ message: '邮箱不能为空' })
    readonly email: string

    @IsString({ message: '密码格式不正确' })
    @IsNotEmpty({ message: '密码不能为空' })
    readonly password: string

    @IsOptional()
    @IsEnum(Gender, { message: '性别格式不正确' })
    readonly gender?: Gender
}

export class UpdateUserInfoDto {
    @IsUUID()
    readonly uid: string

    @IsOptional()
    @IsString()
    readonly username?: string

    @IsOptional()
    @IsEmail()
    readonly email?: string

    @IsOptional()
    @IsString()
    readonly password?: string

    @IsOptional()
    @IsEnum(Gender)
    readonly gender?: Gender
}