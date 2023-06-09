import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto, UpdateUserInfoDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) { }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.userService.register(registerDto)
  }

  @Post('update')
  async update(@Body() updateUserInfoDto: UpdateUserInfoDto) {
    return this.userService.updateUserInfo(updateUserInfoDto)
  }

}
