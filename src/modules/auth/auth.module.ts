import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthUserService } from './services/auth-user.service';
import { AuthWorkerController } from './controllers/authWorker.controller';
import { AuthWorkerService } from './services/authWorker.service';
import { AuthWorkerRepository } from './repositories/authWorker.repository';
import { AuthUserController } from './controllers/auth-user.controller';
import { UserModule } from '../user/user.module';
import { AccessToken } from './models/accessToken.model';
import { RefreshToken } from './models/refreshToken.model';
import { GoogleStrategy } from './strategies/google.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { AccessTokenRepository } from './repositories/access-token.repository';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ResetToken } from './models/resetToken.model';
import { GoogleWorkerStrategy } from './workerStrategies/googleWorker.strategy';
import { FacebookWorkerStrategy } from './workerStrategies/facebookWorker.strategy';
import { WorkerTokenService } from './services/workerTokenService';
import { VerificationToken } from './models/verificationToken.model';

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
    GoogleStrategy,
    FacebookStrategy,
    AccessTokenRepository,
    RefreshTokenRepository,
    AuthWorkerService, 
    AuthWorkerRepository, 
    GoogleWorkerStrategy,
    FacebookWorkerStrategy, 
    ConfigService,
    WorkerTokenService
  ]
})
export class AuthModule {}
