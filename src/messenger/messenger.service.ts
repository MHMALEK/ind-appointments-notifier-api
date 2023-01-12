import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { IND_SERVICES_LABELS } from 'src/types/ind-services';

export const defaultMesasgePayload = {
  telegramId: 1949747267,
  message: 'you have a new message',
  email: 'mhos.malek@gmail.com',
};
@Injectable()
export class MessengerService {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}

  private async sendTelegramMessage(payload) {
    await firstValueFrom(
      this.httpService.get(
        `${this.configService.get(
          'MESSENGER_APP_BASE_API',
        )}/telegram/send?chatId=${payload.telegramId}&message=${
          payload.message
        }`,
      ),
    );
  }

  private async sendEmailMessage(payload) {
    console.log('payload', payload);
    await firstValueFrom(
      this.httpService.get(
        `${this.configService.get('MESSENGER_APP_BASE_API')}/mail/send?to=${
          payload.email
        }&html=${payload.message}&subject=verify email to get IND notification`,
      ),
    );
  }
  sendMessageToUser(user, message) {
    const { telegramId, email } = user;

    console.log('22222', user, message);
    if (telegramId) {
      this.sendTelegramMessage({
        telegramId,
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
    const { date, telegramId, service, email } = payload;
    if (telegramId) {
      this.sendTelegramMessage({
        telegramId,
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
