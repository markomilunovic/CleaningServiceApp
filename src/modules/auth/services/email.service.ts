import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {

    constructor(private configService: ConfigService) {
        sgMail.setApiKey(this.configService.get<string>('SENDGRID_API_KEY'));
    };

    async sendResetPasswordEmail(email: string, token: string, personId: number): Promise<void> {
        try {
            const emailPerson = this.configService.get<string>('EMAIL_USER');
            if (!emailPerson) {
                throw new Error('Email sender address is not configured.');
            };

            const msg = {
                to: email,
                from: emailPerson,
                subject: 'Reset Your Password',
                text: `Please use the following link to reset your password: http://localhost:3000/auth/reset-password/${personId}/${token}`,
                html: `<p>Please use the following link to reset your password: <a href="http://localhost:3000/auth/reset-password/${personId}/${token}">Reset Password</a></p>`,
            };

            await sgMail.send(msg);
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Failed to send email:', error);
            throw new InternalServerErrorException('Failed to send email.');
        };
    };
};
