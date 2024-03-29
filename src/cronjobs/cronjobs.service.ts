import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class CronjobsService {
  constructor(private notifierService: NotificationService) {}

  @Cron(CronExpression.EVERY_4_HOURS)
  async cronJobfindUsersThatHasRequestedASlot() {
    this.notifierService.findUsersThatHasRequestedASlotSoonerThanCurrentSoonestAvailableSlot();
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async cronJobfindUsersWithExpiredRequestsAndDeleteThemFromDB() {
    this.notifierService.updateDataBaseAndRemoveOutdatedRequests();
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async malek() {
    console.log('malek');
  }
}
