import { IsNotEmpty, IsOptional } from 'class-validator';

export class sendMailMessageDTO {
  @IsNotEmpty()
  to: string;

  @IsOptional()
  text: string;

  @IsOptional()
  subject: string;

  @IsOptional()
  html: string;
}
