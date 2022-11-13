import { Module } from '@nestjs/common';
import { AppointmentsModule } from 'src/appointments/appointments.module';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { TimesModule } from 'src/times/times.module';
import { TimesService } from 'src/times/times.service';
import { CronjobsService } from './cronjobs.service';

@Module({
  providers: [CronjobsService, AppointmentsService, TimesService],
  imports: [AppointmentsModule, TimesModule],
  exports: [CronjobsService],
})
export class CronjobsModule {}
