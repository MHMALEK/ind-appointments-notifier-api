import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsOptional()
  @IsString()
  push: string;
  @IsEmail()
  @IsOptional()
  email: string;
  @IsString()
  desk: string;
  @IsString()
  service: string;
  @IsString()
  date: string;
}
