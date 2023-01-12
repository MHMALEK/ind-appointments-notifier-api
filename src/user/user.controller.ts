import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
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

  @Get('/verify/:userId')
  async verifyUserByEmailGet(@Param('userId') userId: string) {
    try {
      const item = await this.userService.verifyUserEmail(userId);
      return 'Your email is verified now! You can use IND application to get notified about new appointments! Create a new Notification Now!';
    } catch (e) {
      throw new HttpException('Something went wrong', 500);
    }
  }
}
