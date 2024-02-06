import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
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
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  private async sendPushMessage(payload: SendPushNotificationDTO) {
    await this.pushNotificationService.sendPushNotification(payload);
  }

  private async sendEmailMessage(payload: sendMailMessageDTO) {
    this.mailService.sendMail(payload);
  }

  private async sendTelegramMessage(payload: {
    telegram_chat_id: string;
    message: string;
  }) {
    try {
      const telegramApiUrl = this.configService.get('TELEGRAM_API_URL');
      await this.httpService
        .post(`${telegramApiUrl}/send-message`, payload)
        .toPromise();
    } catch (e) {
      console.log(e);
      throw new HttpException('there was an error sending the message', 500);
    }
  }
  sendMessageToUser(user, message, title, prefered_way_of_communication) {
    const { pushToken, email, telegram_chat_id } = user;
    console.log(
      'telegram_chat_id',
      telegram_chat_id,
      pushToken,
      email,
      user,
      message,
      title,
      prefered_way_of_communication,
    );

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
    console.log(
      'telegram_chat_id',
      telegram_chat_id,
      prefered_way_of_communication,
      message,
    );
    if (prefered_way_of_communication === PreferedWayOfCommunication.TELEGRAM) {
      // send telegram message
      this.sendTelegramMessage({
        telegram_chat_id,
        message,
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
