import { Injectable, InternalServerErrorException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { JobRepository } from './job.repository';
import { CreateJobDTO } from './dto/create-job.dto';
import { Job } from './job.model';
import { JobQueryParamsDto } from './dto/job-query-params.dto';
import { JobApplicationDTO } from './dto/job-application.dto';
import { WorkerRepository } from 'modules/worker/repositories/worker.repository';

@Injectable()
export class JobService {
  constructor(
    private readonly jobRepository: JobRepository,
    private readonly workerRepository: WorkerRepository,
  ) {}

  async createJob(createJobDTO: CreateJobDTO, userId: number): Promise<Job> {
    try {
      createJobDTO.userId = userId;
      return await this.jobRepository.create(createJobDTO);
    } catch (error) {
      console.error('Failed to create job:', error);
      throw new InternalServerErrorException('Failed to create job');
    }
  }

  async findAll(query: JobQueryParamsDto): Promise<{ rows: Job[]; count: number }> {
    try {
      return await this.jobRepository.findAll(query);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Failed to retrieve jobs:', error);
      throw new InternalServerErrorException('Failed to retrieve jobs');
    }
  }

  async applyForJob(jobId: number, jobApplicationDTO: JobApplicationDTO): Promise<void> {
    const { workerId } = jobApplicationDTO;

    const worker = await this.workerRepository.findWorkerById(workerId);
    if (!worker || !worker.verifiedByAdmin) {
      throw new BadRequestException('Worker is not verified');
    }

    try {
      await this.jobRepository.updateStatus(jobId, 'accepted', workerId);
    } catch (error) {
      console.error('Failed to apply for job:', error);
      throw new InternalServerErrorException('Failed to apply for job');
    }
  }

  async confirmJob(jobId: number, userId: number): Promise<void> {
    const job = await this.jobRepository.findById(jobId);

    if (!job) {
      throw new BadRequestException('Job not found');
    }

    if (job.userId !== userId) {
      throw new ForbiddenException('You are not authorized to confirm this job');
    }

    try {
      await this.jobRepository.updateStatus(jobId, 'completed');
    } catch (error) {
      console.error('Failed to confirm job:', error);
      throw new InternalServerErrorException('Failed to confirm job');
    }
  }
}
