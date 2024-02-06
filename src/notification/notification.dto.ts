import { IsOptional, IsString } from 'class-validator';

export enum PreferedWayOfCommunication {
  EMAIL = 'email',
  PUSH_NOTIFICATION = 'push_notification',
  TELEGRAM = 'telegram',
}
export class CreateNotificationDto {
  @IsString()
  desk: string;
  @IsString()
  service: string;
  @IsString()
  date: string;
  @IsString()
  firebase_user_id: string;
  @IsOptional()
  @IsString()
  telegram_chat_id: string;
  @IsString()
  prefered_way_of_communication: PreferedWayOfCommunication;
}

export class CreateNotificationTelegramDto {
  @IsString()
  desk: string;
  @IsString()
  service: string;
  @IsString()
  date: string;
  @IsString()
  telegram_chat_id: string;
  @IsString()
  prefered_way_of_communication: PreferedWayOfCommunication.TELEGRAM;
}
