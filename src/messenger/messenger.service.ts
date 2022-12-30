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
    await firstValueFrom(
      this.httpService.get(
        `${this.configService.get('MESSENGER_APP_BASE_API')}/email/send?to=${
          payload.email
        }&text=${payload.message}&subject=new IND notification`,
      ),
    );
  }
  sendMessageToUser(payload) {
    const { date, telegramId, service, email } = payload;

    if (telegramId) {
      this.sendTelegramMessage({
        telegramId,
        message: this.generateMessage({ date, service }),
      });
    }
    if (email) {
      this.sendEmailMessage({
        email,
        message: this.generateMessage({ date, service }),
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
}
