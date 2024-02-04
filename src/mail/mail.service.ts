import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

export interface MailPayload {
  to: string;
  subject?: string;
  text?: string;
  html?: string;
}
@Injectable()
export class MailService {
  defaultMailPayload: MailPayload;
  constructor(private readonly mailerService: MailerService) {}
  public sendMail({ to, subject, text, html }: MailPayload): void {
    this.mailerService
      .sendMail({
        to,
        from: 'ind-appointments-notification@indnotifier.com',
        subject,
        text,
        html,
      })
      .then(() => {
        return 'mail has been successfully sent';
      })
      .catch((e) => {
        console.log(e);

        return 'send mail failed';
      });
  }
}
