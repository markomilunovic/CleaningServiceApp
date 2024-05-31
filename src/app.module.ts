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
<<<<<<< HEAD
import { AuthModule } from './modules/auth/auth.module';
import { RefreshToken } from 'modules/auth/models/refreshToken.model';
import { ResetToken } from 'modules/auth/models/resetToken.model';
import { VerificationToken } from 'modules/auth/models/verificationToken.model';

=======
import { RefreshToken } from 'modules/auth/models/refreshToken.model';
import { ResetToken } from 'modules/auth/models/resetToken.model';
import { VerificationToken } from 'modules/auth/models/verificationToken.model';
import { AuthModule } from 'modules/auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from 'app.service';
>>>>>>> develop

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
<<<<<<< HEAD
    SequelizeModule.forFeature([User, Worker, Job, Transaction, Message, AccessToken, RefreshToken, ResetToken, VerificationToken]),
=======
>>>>>>> develop
    AuthModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
