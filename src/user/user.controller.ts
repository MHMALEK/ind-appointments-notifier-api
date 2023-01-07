import { Body, Controller, Get, HttpException, Post } from '@nestjs/common';
import { CreateUserDto } from './CreatNewUser.dto';
import { UserService } from './user.service';
import { VerifyUserDto } from './VerifyUser.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Post('/create')
  async saveNewUser(@Body() body: CreateUserDto) {
    try {
      const item = await this.userService.createNewUser(body);
      return item;
    } catch (e) {
      throw new HttpException('Something went wrong', 500);
    }
  }

  @Post('/verify')
  async verifyUserByEmail(@Body() body: VerifyUserDto) {
    try {
      const item = await this.userService.verifyUserEmail(body.userId);
      return item;
    } catch (e) {
      throw new HttpException('Something went wrong', 500);
    }
  }

  @Get('/verify')
  async verifyUserByEmailGet(@Body() body: VerifyUserDto) {
    try {
      const item = await this.userService.verifyUserEmail(body.userId);
      return item;
    } catch (e) {
      throw new HttpException('Something went wrong', 500);
    }
  }
}
