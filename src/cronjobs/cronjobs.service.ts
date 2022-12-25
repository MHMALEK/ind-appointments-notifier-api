import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { MessengerService } from 'src/messenger/messenger.service';
import { NewAppointmentNotifierService } from 'src/new-appointment-notifier/new-appointment-notifier.service';
import { TimesService } from 'src/times/times.service';

@Injectable()
export class CronjobsService {
  constructor(private notifierService: NewAppointmentNotifierService) {}
  private readonly logger = new Logger(CronjobsService.name);

  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  async cronJobUpdateAppointmentsDatabase() {
    // this.logger.debug('Called every 10 seconds');
    // const soonestTime = await this.appointmentService.findSoonest({
    //   service: IND_SERVICES.COLLECT_DOCUMENTS,
    //   numberOfPeople: 1,
    //   desk: IND_DESKS.DEN_BOSCH,
    // });
    // const usersHaveRequestedTimeSoonerThanLatestAvailabelTime =
    //   await this.timeServices.findUsersThatRequestedTimeIsSoonerThanLatestAvailabelTime(
    //     soonestTime,
    //   );
    // if (usersHaveRequestedTimeSoonerThanLatestAvailabelTime.length > 0) {
    //   usersHaveRequestedTimeSoonerThanLatestAvailabelTime.map((user) =>
    //     this.messengerService.sendMessageToUser({
    //       userId: user.telegramId,
    //       message: this.messengerService.generateMessage(user.date),
    //     }),
    //   );
    // }
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async cronjobSendMessageTest() {
    this.logger.debug('test cron job on digital ocean');
    this.notifierService.sendTestMessage();
  }

  @Cron(CronExpression.EVERY_2_HOURS)
  async cronJobfindUsersThatHasRequestedASlot() {
    this.logger.debug('find users');
    this.notifierService.findUsersThatHasRequestedASlotSoonerThanCurrentSoonestAvailableSlot();
  }
}
