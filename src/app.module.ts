import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { User } from 'modules/user/user.model';
import { Worker } from 'modules/worker/worker.model';
import { Job } from 'modules/job/job.model';
import { Transaction } from 'modules/transaction/transaction.model';
import { Message } from 'modules/message/message.model';
import { AccessToken } from 'modules/auth/models/accessToken.model';
import { AuthModule } from './modules/auth/auth.module';
import { RefreshToken } from 'modules/auth/models/refreshToken.model';
import { ResetToken } from 'modules/auth/models/resetToken.model';
import { VerificationToken } from 'modules/auth/models/verificationToken.model';


@Module({
  imports: [
    ConfigModule.forRoot(), 
    SequelizeModule.forRootAsync({
      imports: [ConfigModule], 
      inject: [ConfigService], 
      useFactory: (configService: ConfigService): SequelizeModuleOptions => ({
        dialect: configService.get<any>('DB_DIALECT'), 
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT'), 10), 
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        models: [User, Worker, Job, Transaction, Message, AccessToken, RefreshToken, ResetToken, VerificationToken],
        autoLoadModels: true,
        synchronize: true,
      }),
    }),
    SequelizeModule.forFeature([User, Worker, Job, Transaction, Message, AccessToken, RefreshToken, ResetToken, VerificationToken]),
    AuthModule,
  ],
})
export class AppModule {}
