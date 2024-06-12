import { Module } from '@nestjs/common';
import { MessageController } from './controllers/message.controller';
import { MessageService } from './services/message.service';
import { MessageRepository } from './repositories/message.repository';
import { ConfigModule } from '@nestjs/config';
import { Message } from './models/message.model';
import { Job } from 'modules/job/job.model';
import { User } from 'modules/user/models/user.model';
import { Worker } from 'modules/worker/models/worker.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { JobRepository } from 'modules/job/job.repository';

@Module({
  imports: [
    ConfigModule,
    SequelizeModule.forFeature([Message, Job, User, Worker])
  ],
  controllers: [MessageController],
  providers: [MessageService, MessageRepository, JobRepository]
})
export class MessageModule {};
