import { IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  desk: string;
  @IsString()
  service: string;
  @IsString()
  date: string;
  @IsString()
  firebase_user_id: string;
}
