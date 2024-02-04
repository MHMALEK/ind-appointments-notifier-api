import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MessengerService } from './messenger.service';
import { MailModule } from 'src/mail/mail.module';
import { PushNotificationModule } from 'src/push-notification/push-notification.module';

@Module({
  providers: [MessengerService],
  imports: [HttpModule, MailModule, PushNotificationModule],
  exports: [HttpModule, MessengerService],
})
export class MessengerModule {}
