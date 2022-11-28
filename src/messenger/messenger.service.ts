import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import IND_SERVICES, { IND_SERVICES_LABELS } from 'src/types/ind-services';

export const defaultMesasgePayload = {
  telegramId: 1949747267,
  message: 'you have a new message',
};
@Injectable()
export class MessengerService {
  private baseMessnger = 'https://telegram-bot-api-with-key.oa.r.appspot.com';
  constructor(private readonly httpService: HttpService) {}

  private async sendTelegramMessage(payload = defaultMesasgePayload) {
    await firstValueFrom(
      this.httpService.get(
        `${this.baseMessnger}/send?userId=${payload.telegramId}&message=${payload.message}`,
      ),
    );
  }
  sendMessageToUser(payload) {
    console.log('payload', payload);
    const { date, telegramId, service } = payload;
    this.sendTelegramMessage({
      telegramId,
      message: this.generateMessage({ date, service }),
    });
  }
  generateMessage(payload) {
    console.log(payload.service, IND_SERVICES_LABELS);
    return `There is a new slot is available for ${IND_SERVICES_LABELS[
      payload.service
    ].toLowerCase()} on this time: ${payload.date}`;
  }
}
