import { Injectable, Logger } from '@nestjs/common';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { TimesService } from 'src/times/times.service';
import IND_DESKS from 'src/types/ind-desks';
import IND_SERVICES from 'src/types/ind-services';

@Injectable()
export class CronjobsService {
  constructor(
    private appointmentService: AppointmentsService,
    private timeServices: TimesService,
  ) {}
  private readonly logger = new Logger(CronjobsService.name);
  //   @Cron(CronExpression.EVERY_30_SECONDS)
  async cronJobUpdateAppointmentsDatabase() {
    this.logger.debug('Called every 30 seconds');
    const soonestTime = await this.appointmentService.findSoonest({
      service: IND_SERVICES.COLLECT_DOCUMENTS,
      numberOfPeople: 1,
      desk: IND_DESKS.DEN_BOSCH,
    });
    const usersHaveRequestedTimeSoonerThanLatestAvailabelTime =
      await this.timeServices.findUsersThatRequestedTimeIsSoonerThanLatestAvailabelTime(
        soonestTime,
      );
  }
}
