import { Module } from '@nestjs/common';
<<<<<<< HEAD
import { AuthWorkerController } from './controllers/auth.controller';
import { AuthWorkerService } from './services/authWorker.service';
import { AuthWorkerRepository } from './repositories/authWorker.repository';

@Module({
    controllers: [AuthWorkerController],
    providers: [AuthWorkerService, AuthWorkerRepository]
})
export class AuthModule {};
=======
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
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
    SequelizeModule.forFeature([AccessToken, RefreshToken]),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    FacebookStrategy,
    AccessTokenRepository,
    RefreshTokenRepository,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
>>>>>>> develop
