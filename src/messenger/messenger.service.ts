import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { sendMailMessageDTO } from 'src/mail/DTO/sendMailMessage.dto';
import { MailService } from 'src/mail/mail.service';
import { PreferedWayOfCommunication } from 'src/notification/notification.dto';
import { SendPushNotificationDTO } from 'src/push-notification/DTO/push-notification.dto';
import { PushNotificationService } from 'src/push-notification/push-notification.service';
import { IND_SERVICES_LABELS } from 'src/types/ind-services';

export const defaultMesasgePayload = {
  push: 1949747267,
  message: 'you have a new message',
  email: 'mhos.malek@gmail.com',
};
@Injectable()
export class MessengerService {
  constructor(
    private pushNotificationService: PushNotificationService,
    private mailService: MailService,
  ) {}

  private async sendPushMessage(payload: SendPushNotificationDTO) {
    await this.pushNotificationService.sendPushNotification(payload);
  }

  private async sendEmailMessage(payload: sendMailMessageDTO) {
    await this.mailService.sendMail(payload);
  }
  sendMessageToUser(user, message, title, prefered_way_of_communication) {
    const { pushToken, email } = user;

    if (
      prefered_way_of_communication ===
      PreferedWayOfCommunication.PUSH_NOTIFICATION
    ) {
      this.sendPushMessage({
        pushToken,
        message,
        title,
      });
    }
    if (prefered_way_of_communication === PreferedWayOfCommunication.EMAIL) {
      this.sendEmailMessage({
        to: email,
        subject: title,
        html: message,
        text: message,
      });
    }
  }
  generateMessage(payload) {
    return `Hooray! There is a new slot is available for ${IND_SERVICES_LABELS[
      payload.service
    ].toLowerCase()} on this time: ${payload.date}`;
  }

  generateExpiredRequestMessage(payload) {
    return `Your request for ${IND_SERVICES_LABELS[
      payload.service
    ].toLowerCase()} on this time: ${
      payload.date
    } has been expired. you can create a new one.`;
  }

  generateVerificationEmail(userId) {
    return `<p>Hello</p><p>You have requested to be notified for IND services. If you didn't request it, please ignore this email, otherwise please verify your email address by clicking on the link below:</p>
    <p><a href="${process.env.BASE_URL}/users/verify/${userId}">Verify my email</a></p>
    `;
  }
}
