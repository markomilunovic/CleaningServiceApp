import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Job } from './job.model';
import { JobRepository } from './job.repository';
import { JobService } from './job.service';
import { JobController } from './job.controller';

@Module({
  imports: [SequelizeModule.forFeature([Job])],
  providers: [JobRepository, JobService],
  controllers: [JobController],
})
export class JobModule {}
