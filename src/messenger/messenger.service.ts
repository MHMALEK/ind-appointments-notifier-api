import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { IND_SERVICES_LABELS } from 'src/types/ind-services';

export const defaultMesasgePayload = {
  telegramId: 1949747267,
  message: 'you have a new message',
};
@Injectable()
export class MessengerService {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}

  private async sendTelegramMessage(payload = defaultMesasgePayload) {
    await firstValueFrom(
      this.httpService.get(
        `${this.configService.get('IND_BOT_BASE_API')}/telegram/send?chatId=${
          payload.telegramId
        }&message=${payload.message}`,
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
    return `There is a new slot is available for ${IND_SERVICES_LABELS[
      payload.service
    ].toLowerCase()} on this time: ${payload.date}`;
  }
}
