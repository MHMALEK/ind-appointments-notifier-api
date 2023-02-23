import { Module } from '@nestjs/common';
import { AppointmentsModule } from 'src/appointments/appointments.module';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { IndContentService } from 'src/ind-content/ind-content.service';
import { MessengerService } from 'src/messenger/messenger.service';
import { NotificationModule } from 'src/notification/notification.module';
import { NotificationService } from 'src/notification/notification.service';
import { UserService } from 'src/user/user.service';
import { CronjobsService } from './cronjobs.service';

@Module({
  providers: [
    CronjobsService,
    AppointmentsService,
    MessengerService,
    UserService,
    IndContentService,
    NotificationService,
  ],
  imports: [AppointmentsModule, NotificationModule],
  exports: [CronjobsService],
})
export class CronjobsModule {}
