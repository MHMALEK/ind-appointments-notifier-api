import { Module } from '@nestjs/common';
import { AppointmentsModule } from 'src/appointments/appointments.module';
import { NotificationModule } from 'src/notification/notification.module';
import { CronjobsService } from './cronjobs.service';

@Module({
  providers: [CronjobsService],
  imports: [AppointmentsModule, NotificationModule],
  exports: [CronjobsService],
})
export class CronjobsModule {}
