import { IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;
  @IsOptional()
  pushToken: string | undefined | null;
  firebase_user_id: string;
}
