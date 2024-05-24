import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from 'modules/user/user.module';
import { AccessToken } from './models/accessToken.model';
import { RefreshToken } from './models/refreshToken.model';
import { GoogleStrategy } from './strategies/google.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    PassportModule,
    SequelizeModule.forFeature([AccessToken, RefreshToken]),
    ConfigModule
  ],
  providers: [
    GoogleStrategy,
    FacebookStrategy,
  ],
})
export class AuthModule {}
