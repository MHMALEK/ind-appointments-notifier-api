import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
} from '@nestjs/common';
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
      return res;
    } catch (e: any) {
      console.log(e);
      throw new HttpException(
        e.response || 'Something went wrong',
        e.status || 500,
      );
    }
  }
  @Get('cancel/:notificationId')
  async cancelNotification(@Param('notificationId') notificationId: string) {
    try {
      const res = await this.notificationService.cancelNotification(
        notificationId,
      );
      console.log('ree', res);
      if (res) {
        return { success: true };
      }
    } catch (e) {
      throw new HttpException('something went wrong', 500);
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
