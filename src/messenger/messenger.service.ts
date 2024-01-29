import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { IND_SERVICES_LABELS } from 'src/types/ind-services';

export const defaultMesasgePayload = {
  push: 1949747267,
  message: 'you have a new message',
  email: 'mhos.malek@gmail.com',
};
@Injectable()
export class MessengerService {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}

  private async sendPushMessage(payload) {
    await firstValueFrom(
      this.httpService.post(
        `${this.configService.get('MESSENGER_APP_BASE_API')}/push/send`,
        {
          devices: [payload.push],
          body: payload.message,
          title: 'new Appointment is available',
        },
      ),
    );
  }

  private async sendEmailMessage(payload) {
    await firstValueFrom(
      this.httpService.post(
        `${this.configService.get('MESSENGER_APP_BASE_API')}/mail/send`,
        {
          to: payload.email,
          html: payload.message,
          subject: 'verify email to get IND notification',
        },
      ),
    );
  }
  sendMessageToUser(user, message) {
    const { push, email } = user;

    if (push) {
      this.sendPushMessage({
        push,
        message,
      });
    }
    if (email) {
      this.sendEmailMessage({
        email,
        message,
      });
    }
  }
  generateMessage(payload) {
    return `Hooray! There is a new slot is available for ${IND_SERVICES_LABELS[
      payload.service
    ].toLowerCase()} on this time: ${payload.date}`;
  }

  sendExpiredRequestMessageToUser(payload) {
    const { date, push, service, email } = payload;
    if (push) {
      this.sendPushMessage({
        push,
        message: this.generateExpiredRequestMessage({ date, service }),
      });
    }
    if (email) {
      this.sendEmailMessage({
        email,
        message: this.generateExpiredRequestMessage({ date, service }),
      });
    }
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

  sendVerificationEmail(user) {
    this.sendEmailMessage({
      email: user.email,
      message: this.generateVerificationEmail(user.id),
    });
  }
}
