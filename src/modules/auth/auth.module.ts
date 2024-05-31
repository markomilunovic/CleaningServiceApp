import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthUserService } from './services/auth-user.service';
import { AuthWorkerController } from './controllers/auth-worker.controller';
import { AuthWorkerService } from './services/auth-worker.service';
import { AuthWorkerRepository } from './repositories/auth-worker.repository';
import { AuthUserController } from './controllers/auth-user.controller';
import { UserModule } from '../user/user.module';
import { AccessToken } from './models/access-token.model';
import { RefreshToken } from './models/refresh-token.model';
import { AccessTokenRepository } from './repositories/access-token.repository';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ResetToken } from './models/reset-token.model';
import { GoogleUserStrategy } from './strategies/user/google-user.strategy';
import { FacebookWorkerStrategy } from './strategies/worker/facebook-worker.strategy';
import { WorkerTokenService } from './services/token-service';
import { VerificationToken } from './models/verification-token.model';
import { GoogleWorkerStrategy } from './strategies/worker/google-worker.strategy';
import { FacebookUserStrategy } from './strategies/user/facebook-user.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('ACCESS_TOKEN_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    SequelizeModule.forFeature([AccessToken, RefreshToken, ResetToken, VerificationToken]),
  ],
  controllers: [AuthWorkerController, AuthUserController],
  providers: [
    AuthWorkerService,
    AuthWorkerRepository,
    AuthUserService,
    JwtStrategy,
    FacebookUserStrategy,
    AccessTokenRepository,
    RefreshTokenRepository,
    AuthWorkerService, 
    AuthWorkerRepository,
    GoogleWorkerStrategy,
    GoogleUserStrategy,
    FacebookWorkerStrategy, 
    ConfigService,
    WorkerTokenService
  ]
})
export class AuthModule {};
