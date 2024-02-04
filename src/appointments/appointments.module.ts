import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { QueryBuilderService } from 'src/query-builder/query-builder.service';
import { MessengerService } from 'src/messenger/messenger.service';
import { IndContentService } from 'src/ind-content/ind-content.service';
import { PushNotificationModule } from 'src/push-notification/push-notification.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  providers: [
    AppointmentsService,
    QueryBuilderService,
    MessengerService,
    IndContentService,
  ],
  imports: [HttpModule, PushNotificationModule, MailModule],
  controllers: [AppointmentsController],
  exports: [AppointmentsService, QueryBuilderService, HttpModule],
})
export class AppointmentsModule {}
