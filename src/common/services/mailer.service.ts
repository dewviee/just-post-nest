import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { EMailerBodyType } from '../enum/mailer.enum';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor() {
    this.transporter = this.initTransporter();
  }

  async sendEmail(
    subject: string,
    to: string,
    body: string,
    bodyType: EMailerBodyType,
  ) {
    const sendEmailOptions: Mail.Options = {
      to: to,
      subject: subject,
    };

    switch (bodyType) {
      case EMailerBodyType.HTML:
        sendEmailOptions.html = body;
        break;
      case EMailerBodyType.TEXT:
        sendEmailOptions.text = body;
        break;
    }

    return await this.transporter.sendMail(sendEmailOptions);
  }

  private initTransporter() {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number.parseInt(process.env.SMTP_PORT),
      secure: false, // Use `true` for port 465, `false` for all other ports
      from: process.env.SMTP_USER,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
}
