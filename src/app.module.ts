import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { TimeCompareService } from './time-compare/time-compare.service';
import { TimeCompareModule } from './time-compare/time-compare.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronjobsService } from './cronjobs/cronjobs.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentsService } from './appointments/appointments.service';
import { AppointmentsModule } from './appointments/appointments.module';
import { QueryBuilderModule } from './query-builder/query-builder.module';
import { QueryBuilderService } from './query-builder/query-builder.service';
import { DbModule } from './db/db.module';
import { CronjobsModule } from './cronjobs/cronjobs.module';

@Module({
  imports: [
    HttpModule,
    TimeCompareModule,
    ScheduleModule.forRoot(),
    UsersModule,
    MongooseModule.forRoot(
      'mongodb+srv://vfs-data-base-user:Ka723wQHWtwQXf7A@cluster0.uqiqnc2.mongodb.net/?retryWrites=true&w=majority',
      { dbName: 'appointments' },
    ),
    AppointmentsModule,
    QueryBuilderModule,
    DbModule,
    CronjobsModule,
  ],

  controllers: [AppController],
  providers: [
    AppService,
    TimeCompareService,
    CronjobsService,
    AppointmentsService,
    QueryBuilderService,
  ],
})
export class AppModule {}
