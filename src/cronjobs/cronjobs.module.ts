import { Module } from '@nestjs/common';
import { AppointmentsModule } from 'src/appointments/appointments.module';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { IndContentService } from 'src/ind-content/ind-content.service';
import { MessengerService } from 'src/messenger/messenger.service';
import { NewAppointmentNotifierService } from 'src/new-appointment-notifier/new-appointment-notifier.service';
import { TimesModule } from 'src/times/times.module';
import { TimesService } from 'src/times/times.service';
import { UserService } from 'src/user/user.service';
import { CronjobsService } from './cronjobs.service';

@Module({
  providers: [
    CronjobsService,
    AppointmentsService,
    TimesService,
    MessengerService,
    NewAppointmentNotifierService,
    UserService,
    IndContentService,
  ],
  imports: [AppointmentsModule, TimesModule],
  exports: [CronjobsService],
})
export class CronjobsModule {}
