import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { User } from 'modules/user/user.model';
import { Worker } from 'modules/worker/worker.model';
import { Job } from 'modules/job/job.model';
import { Transaction } from 'modules/transaction/transaction.model';


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
        models: [User, Worker, Job, Transaction],
        autoLoadModels: true,
        synchronize: false,
      }),
    }),
    SequelizeModule.forFeature([User, Worker, Job, Transaction]),
  ],
})
export class AppModule {}
