import { Module } from '@nestjs/common';
import { AppointmentsModule } from 'src/appointments/appointments.module';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { IndContentService } from 'src/ind-content/ind-content.service';
import { MessengerService } from 'src/messenger/messenger.service';
import { NotificationModule } from 'src/notification/notification.module';
import { NotificationService } from 'src/notification/notification.service';
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
    UserService,
    IndContentService,
    NotificationService,
  ],
  imports: [AppointmentsModule, TimesModule, NotificationModule],
  exports: [CronjobsService],
})
export class CronjobsModule {}
