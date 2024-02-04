import { Body, Controller, Post, Query } from '@nestjs/common';
import { sendMailMessageDTO } from './DTO/sendMailMessage.dto';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private mailService: MailService) {}
  @Post('/send')
  sendEmail(@Body() body: sendMailMessageDTO) {
    const { to, subject, text, html } = body;
    this.mailService.sendMail({ to, subject, text, html });
  }
}
