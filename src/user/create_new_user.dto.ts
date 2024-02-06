import { IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email?: string;
  @IsOptional()
  pushToken?: string | undefined | null;
  @IsOptional()
  telegram_chat_id?: string | undefined | null;
  @IsOptional()
  firebase_user_id?: string;
}
