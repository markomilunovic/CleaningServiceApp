import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: this.configService.get<boolean>('EMAIL_SECURE'),
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

  async sendMail(mailOptions: nodemailer.SendMailOptions) {
    await this.transporter.sendMail(mailOptions);
  }

  async sendResetPasswordEmail(to: string, token: string) {
    const url = `${this.configService.get<string>('FRONTEND_URL')}/api/user/confirm-reset-password?token=${token}`;
    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM'),
      to,
      subject: 'Password Reset',
      text: `Please use the following link to reset your password: ${url}`,
    };

    await this.sendMail(mailOptions);
  }
}