import { IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  push: string;
  @IsOptional()
  @IsEmail()
  email: string;
}
