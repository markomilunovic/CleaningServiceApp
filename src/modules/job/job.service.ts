import { Injectable } from '@nestjs/common';
import { JobRepository } from './job.repository';
import { CreateJobDTO } from './dto/create-job.dto';
import { Job } from './job.model';

@Injectable()
export class JobService {
  constructor(private readonly jobRepository: JobRepository) {}

  async createJob(createJobDTO: CreateJobDTO): Promise<Job> {
    return this.jobRepository.create(createJobDTO);
  }
}
