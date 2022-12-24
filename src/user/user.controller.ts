import { Controller, Get, Param, Query } from '@nestjs/common';
import { TimesService } from 'src/times/times.service';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('new/:telegramId')
  saveNewUser(@Param() telgramId: string) {
    // const item = this.userService.saveUserToDatabase(telgramId);
    // return item;
  }

  @Get('time')
  saveLatestTimeWithTelegramId(@Query() query) {
    const item = this.userService.saveUserLatestTime(query);
    return item;
  }
}
