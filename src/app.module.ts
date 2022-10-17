import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IndAmsterdamController } from './ind-amsterdam/ind-amsterdam.controller';
import { IndAmsterdamService } from './ind-amsterdam/ind-amsterdam.service';
import { IndAmsterdamModule } from './ind-amsterdam/ind-amsterdam.module';
import { HttpModule } from '@nestjs/axios';
import { IndAppointmentsModule } from './ind-appointments/ind-appointments.module';
import { IndAppointmentsService } from './ind-appointments/ind-appointments.service';
import { TimeCompareService } from './time-compare/time-compare.service';
import { TimeCompareModule } from './time-compare/time-compare.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronjobsService } from './cronjobs/cronjobs.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    IndAmsterdamModule,
    HttpModule,
    IndAppointmentsModule,
    TimeCompareModule,
    ScheduleModule.forRoot(),
    UsersModule,
  ],
  controllers: [AppController, IndAmsterdamController],
  providers: [
    AppService,
    IndAmsterdamService,
    IndAppointmentsService,
    TimeCompareService,
    CronjobsService,
  ],
})
export class AppModule {}
