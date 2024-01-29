import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Req,
} from '@nestjs/common';
import { CreateNotificationDto } from './notification.dto';
import { NotificationService } from './notification.service';
import { Request } from 'express';

@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}
  @Post('/new')
  async CreateNewNotification(
    @Req() req: Request,
    @Body() notificationPayload: CreateNotificationDto,
  ) {
    try {
      const user = req.user;
      const res = await this.notificationService.createNewnotification(
        user,
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

  @Get('')
  async findmalek() {
    this.notificationService.updateDataBaseAndRemoveOutdatedRequests();
  }
  @Get('/test')
  async findmalek2() {
    this.notificationService.findUsersThatHasRequestedASlotSoonerThanCurrentSoonestAvailableSlot();
  }
}
