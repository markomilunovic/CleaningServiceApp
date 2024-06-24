import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { WorkerModule } from 'modules/worker/worker.module';
import { Job } from './job.model';
import { JobRepository } from './job.repository';
import { JobService } from './job.service';
import { JobController } from './job.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([Job]),
    WorkerModule,
  ],
  providers: [JobRepository, JobService],
  controllers: [JobController],
  exports: [JobRepository],
})
export class JobModule {}