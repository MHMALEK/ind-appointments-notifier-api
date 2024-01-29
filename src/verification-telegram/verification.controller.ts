import { Controller, Get, HttpException, Param } from '@nestjs/common';
import { VerificationPushService } from './verification.service';

@Controller('verification')
export class VerificationController {
  constructor(private verificationService: VerificationPushService) {}
  @Get('/verify/Push')
  async verifyUserByPush(@Param() params: any) {
    try {
      // const item = await this.verificationService.verifyUserEmail(userId);
      // this.verificationService.verifyUserByPush()
      return;
    } catch (e) {
      throw new HttpException('Something went wrong', 500);
    }
  }

  // constructor(private notificationService: NotificationService) {}
  // @Post('/new')
  // async CreateNewNotification(
  //   @Body() notificationPayload: CreateNotificationDto,
  // ) {
  //   try {
  //     const res = await this.notificationService.createNewnotification(
  //       notificationPayload,
  //     );
  //     return res;
  //   } catch (e: any) {
  //     console.log(e);
  //     throw new HttpException(
  //       e.response || 'Something went wrong',
  //       e.status || 500,
  //     );
  //   }
  // }
  // @Get('cancel/:notificationId')
  // async cancelNotification(@Param('notificationId') notificationId: string) {
  //   try {
  //     const res = await this.notificationService.cancelNotification(
  //       notificationId,
  //     );
  //     if (res) {
  //       return { success: true };
  //     }
  //   } catch (e) {
  //     throw new HttpException('something went wrong', 500);
  //   }
  // }
  // @Get('')
  // async findmalek() {
  //   this.notificationService.updateDataBaseAndRemoveOutdatedRequests();
  // }
  // @Get('/test')
  // async findmalek2() {
  //   this.notificationService.findUsersThatHasRequestedASlotSoonerThanCurrentSoonestAvailableSlot();
  // }
}