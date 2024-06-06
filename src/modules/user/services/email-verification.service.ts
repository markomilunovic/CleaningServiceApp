import { Injectable, ConflictException, InternalServerErrorException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import { User } from '../models/user.model';
import { VerificationTokenRepository } from 'modules/auth/repositories/verification-token.repository';

@Injectable()
export class EmailVerificationService {
  constructor(
    private readonly verificationTokenRepository: VerificationTokenRepository,
    @Inject('VERIFICATION_JWT_SERVICE')
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async generateVerificationToken(user: User): Promise<string> {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const verificationToken = await this.verificationTokenRepository.create(user.id, expiresAt);

    const tokenPayload = {
      jti: verificationToken.id,
      sub: user.id,
    };

    return this.jwtService.sign(tokenPayload);
  }

  async sendVerificationEmail(user: User, token: string) {
    const url = `${this.configService.get<string>('FRONTEND_URL')}/api/user/verify?token=${token}`;
    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM'),
      to: user.email,
      subject: 'Email Verification',
      text: `Please verify your email using the following link: ${url}`,
    };

    await this.emailService.sendMail(mailOptions);
  }

  async verifyToken(token: string): Promise<void> {
    try {
      const decodedToken = this.jwtService.verify(token);

      const verificationToken = await this.verificationTokenRepository.findOneByTokenIdAndUserId(decodedToken.jti, decodedToken.sub);

      if (!verificationToken) {
        throw new ConflictException('Invalid or expired verification token.');
      }

      await this.verificationTokenRepository.revokeToken(verificationToken.id);

      await User.update(
        { emailVerified: true },
        { where: { id: verificationToken.userId } }
      );
    } catch (error) {
      throw new InternalServerErrorException('Error verifying token.');
    }
  }
}