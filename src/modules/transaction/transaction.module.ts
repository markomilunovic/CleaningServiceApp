import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TransactionRepository } from './transaction.repository';
import { Transaction } from './transaction.model';
import { UserModule } from 'modules/user/user.module';
import { WorkerModule } from 'modules/worker/worker.module';
import { JobModule } from 'modules/job/job.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Transaction]),
    UserModule,
    WorkerModule,
    JobModule,
  ],
  providers: [TransactionService, TransactionRepository],
  controllers: [TransactionController],
})
export class TransactionModule {}
