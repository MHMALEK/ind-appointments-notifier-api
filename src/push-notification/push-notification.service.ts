import { Injectable } from '@nestjs/common';
import { SendPushNotificationDTO } from './DTO/push-notification.dto';
import * as firebase from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

export interface MailPayload {
  to: string;
  subject?: string;
  text?: string;
  html?: string;
}
@Injectable()
export class PushNotificationService {
  constructor(private configService: ConfigService) {}
  async sendPushNotification(payload: SendPushNotificationDTO) {
    const { title, message: body, pushToken } = payload;
    try {
      await firebase
        .messaging()
        .send({
          notification: {
            title,
            body,
          },
          webpush: {
            fcmOptions: {
              link: `${this.configService.get('BASE_URL')}/push-notification`,
            },
          },

          token: pushToken,
          android: { priority: 'high' },
        })
        .catch((error: any) => {
          throw new Error(error);
        });
    } catch (error) {
      return error;
    }
  }
}
