import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.model';
import { UserRepository } from './user.repository';
import { EmailService } from './email.service';
import { EmailVerificationService } from './email-verification.service';
import { VerificationToken } from 'modules/auth/models/verification-token.model';
import { ResetToken } from 'modules/auth/models/reset-token.model';
import { VerificationTokenRepository } from 'modules/auth/repositories/verification-token.repository';

@Module({
  imports: [
    ConfigModule,
    SequelizeModule.forFeature([User, VerificationToken, ResetToken]),
    JwtModule.register({}),
  ],
  providers: [
    UserService, 
    UserRepository, 
    EmailService, 
    EmailVerificationService,
    VerificationTokenRepository,
    {
      provide: 'VERIFICATION_JWT_SERVICE',
      useFactory: async (configService: ConfigService) => {
        return new JwtService({
          secret: configService.get<string>('VERIFICATION_TOKEN_SECRET'),
          signOptions: { expiresIn: '24h' },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'RESET_JWT_SERVICE',
      useFactory: async (configService: ConfigService) => {
        return new JwtService({
          secret: configService.get<string>('RESET_TOKEN_SECRET'),
          signOptions: { expiresIn: '1h' },
        });
      },
      inject: [ConfigService],
    },
  ],
  controllers: [UserController],
  exports: [UserService, UserRepository],
})
export class UserModule {}
