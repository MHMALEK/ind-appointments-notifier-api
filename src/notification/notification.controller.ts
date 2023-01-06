import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { CreateNotificationDto } from './notification.dto';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}
  @Post('/new')
  async CreateNewNotification(
    @Body() notificationPayload: CreateNotificationDto,
  ) {
    try {
      console.log('notificationPayload', notificationPayload);
      const res = await this.notificationService.createNewnotification(
        notificationPayload,
      );
      console.log('controller', res);
      // return 'Notification created';
      return res;
    } catch (e) {
      throw new HttpException('Something went wrong', 500);
    }
  }
}
