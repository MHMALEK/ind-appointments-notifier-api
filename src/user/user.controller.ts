import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('/unsubscribe')
  unsubscribeFromOneNotification(
    @Query('notification_id') notificationId: string,
  ) {
    this.userService.unsubscribeAndRemoveNotificationsForOneService(
      notificationId,
    );
  }
  @Get('/unsubscribe/all')
  unsubscribeFromAllNotifications(
    @Query('notification_id') notification_id: string,
  ) {
    console.log('asda', notification_id);
    this.userService.unsubscribeAndRemoveAllNotificationsAndUser(
      notification_id,
    );
  }
}
