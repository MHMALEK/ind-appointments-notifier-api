import { Body, Controller, Get, HttpException, Post } from '@nestjs/common';
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
      const res = await this.notificationService.createNewnotification(
        notificationPayload,
      );
      // return 'Notification created';
      return res;
    } catch (e) {
      throw new HttpException('Something went wrong', 500);
    }
  }
  @Get('')
  async findmalek() {
    this.notificationService.updateDataBaseAndRemoveOutdatedRequests();
  }
  @Get('/test')
  async findmalek2() {
    this.notificationService.findUsersThatHasRequestedASlotSoonerThanCurrentSoonestAvailableSlot();
  }
}
