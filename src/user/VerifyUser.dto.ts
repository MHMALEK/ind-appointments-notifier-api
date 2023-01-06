import { IsEmail } from 'class-validator';

export class VerifyUserDto {
  @IsEmail()
  email: string;
}
