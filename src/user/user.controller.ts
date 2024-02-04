import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('/unsubscribe')
  async unsubscribeFromOneNotification(
    @Query('notification_id') notificationId: string,
  ) {
    return await this.userService.unsubscribeAndRemoveNotificationsForOneService(
      notificationId,
    );
  }
  @Get('/unsubscribe/all')
  async unsubscribeFromAllNotifications(
    @Query('notification_id') notification_id: string,
  ) {
    return await this.userService.unsubscribeAndRemoveAllNotificationsAndUser(
      notification_id,
    );
  }

  @Delete('/delete')
  async deleteUserAndAllNotifications(@Query('user_id') user_id: string) {
    return await this.userService.deleteUserAndAllNotifications(user_id);
  }

  @Post('/set-push-token')
  async setPushToken(
    @Body('token') token: string,
    @Body('user_id') user_id: string,
    @Body('email') email: string,
  ) {
    return await this.userService.setPushToken(token, user_id, email);
  }
}
