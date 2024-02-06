import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  CreateNotificationDto,
  CreateNotificationTelegramDto,
} from './notification.dto';
import { NotificationService } from './notification.service';
import { Request } from 'express';
import { FirebaseAuthGuard } from 'src/guards/firebase-auth-guard';

@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}
  @UseGuards(FirebaseAuthGuard)
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

  @UseGuards(FirebaseAuthGuard)
  @Get('/list/all')
  async getAllNotificationsForUser(@Req() req: Request) {
    try {
      const user = req.user;
      const res = await this.notificationService.getAllNotificationsForUser(
        user,
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

  @Get('/telegram/list/all')
  async getAllTelegramNotificationsForUser(
    @Req() req: Request,
    @Body() telegram_chat_id: string,
  ) {
    try {
      const res = await this.notificationService.getAllNotificationsForUser({
        telegram_chat_id,
      });
      return res;
    } catch (e: any) {
      console.log(e);
      throw new HttpException(
        e.response || 'Something went wrong',
        e.status || 500,
      );
    }
  }

  @Post('/telegram/create')
  async createTelegramNotification(
    @Req() _: Request,
    @Body() body: CreateNotificationTelegramDto,
  ) {
    const { telegram_chat_id, service, desk, date } = body;
    try {
      const res = await this.notificationService.createNewTelegramNotification(
        telegram_chat_id,
        service,
        desk,
        date,
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
