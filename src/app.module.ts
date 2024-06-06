import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { User } from 'modules/user/models/user.model';
import { Worker } from 'modules/worker/models/worker.model';
import { Job } from 'modules/job/job.model';
import { Transaction } from 'modules/transaction/transaction.model';
import { Message } from 'modules/message/models/message.model';
import { AccessToken } from 'modules/auth/models/access-token.model';
import { RefreshToken } from 'modules/auth/models/refresh-token.model';
import { ResetToken } from 'modules/auth/models/reset-token.model';
import { VerificationToken } from 'modules/auth/models/verification-token.model';
import { AuthModule } from 'modules/auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from 'app.service';
import { WorkerModule } from 'modules/worker/worker.module';
import { JobModule } from 'modules/job/job.module';
import { MessageModule } from 'modules/message/message.module';

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
        synchronize: false,
      }),
    }),
    AuthModule,
    WorkerModule,
    JobModule,
    MessageModule
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}