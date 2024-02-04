import { IsNotEmpty } from 'class-validator';

export class SendPushNotificationDTO {
  @IsNotEmpty()
  pushToken: string;
  @IsNotEmpty()
  message: string;
  @IsNotEmpty()
  title: string;
}
