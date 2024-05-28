import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.model';
import { UserRepository } from './user.repository';
import { EmailService } from './email.service';
import { ResetToken } from '../auth/models/resetToken.model';

@Module({
  imports: [
    ConfigModule,
    SequelizeModule.forFeature([User, ResetToken]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('RESET_TOKEN_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [UserService, UserRepository, EmailService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
