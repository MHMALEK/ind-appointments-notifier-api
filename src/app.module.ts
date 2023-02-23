import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { CronjobsService } from './cronjobs/cronjobs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentsService } from './appointments/appointments.service';
import { AppointmentsModule } from './appointments/appointments.module';
import { QueryBuilderModule } from './query-builder/query-builder.module';
import { QueryBuilderService } from './query-builder/query-builder.service';
import { UserModule } from './user/user.module';
import { MessengerModule } from './messenger/messenger.module';
import { IndContentModule } from './ind-content/ind-content.module';
import { ConfigModule } from '@nestjs/config';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(
      'mongodb+srv://vfs-data-base-user:Ka723wQHWtwQXf7A@cluster0.uqiqnc2.mongodb.net/?retryWrites=true&w=majority',
      { dbName: 'appointments' },
    ),
    AppointmentsModule,
    QueryBuilderModule,
    UserModule,
    MessengerModule,
    IndContentModule,
    NotificationModule,
  ],

  controllers: [AppController],
  providers: [
    AppService,
    CronjobsService,
    AppointmentsService,
    QueryBuilderService,
  ],
})
export class AppModule {}
