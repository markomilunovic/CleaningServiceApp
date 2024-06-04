import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { JobRepository } from './job.repository';
import { CreateJobDTO } from './dto/create-job.dto';
import { Job } from './job.model';
import { JobListDto } from './dto/job-list.dto';

@Injectable()
export class JobService {
  constructor(private readonly jobRepository: JobRepository) {}

  async createJob(createJobDTO: CreateJobDTO): Promise<Job> {
    try {
      return await this.jobRepository.create(createJobDTO);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create job');
    }
  }

  async findAll(query: JobListDto): Promise<{ rows: Job[]; count: number }> {
    try {
      return await this.jobRepository.findAll(query);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve jobs');
    }
  }
}
