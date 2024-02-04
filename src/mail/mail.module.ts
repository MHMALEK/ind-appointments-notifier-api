import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import * as dotenv from 'dotenv';
dotenv.config();
console.log(process.env.MAIL_SMPT_USER, process.env.MAIL_SMPT_PASSWORD);
@Module({
  providers: [MailService],
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp-relay.brevo.com',
        port: 587,
        auth: {
          user: 'mhos.malek@gmail.com',
          pass: 'K8OAFXhQ4dVkMw2T',
        },
      },
    }),
  ],
  controllers: [MailController],
  exports: [MailService],
})
export class MailModule {}
