import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './notification.schema';
import { UserModule } from 'src/user/user.module';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { IndContentService } from 'src/ind-content/ind-content.service';
import { MessengerService } from 'src/messenger/messenger.service';
import { HttpModule } from '@nestjs/axios';
import { AppointmentsModule } from 'src/appointments/appointments.module';

@Module({
  providers: [
    NotificationService,
    AppointmentsService,
    IndContentService,
    MessengerService,
  ],
  controllers: [NotificationController],
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
    UserModule,
    AppointmentsModule,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
