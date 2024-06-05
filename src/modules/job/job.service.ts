import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { JobRepository } from './job.repository';
import { CreateJobDTO } from './dto/create-job.dto';
import { Job } from './job.model';
import { JobListDto } from './dto/job-list.dto';
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
      createJobDTO.workerId = null;
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

  async applyForJob(jobApplicationDTO: JobApplicationDTO): Promise<void> {
    const { jobId, workerId } = jobApplicationDTO;

    const worker = await this.workerRepository.findWorkerById(workerId);
    if (!worker || !worker.verifiedByAdmin) {
      throw new BadRequestException('Worker is not verified');
    }

    try {
      await this.jobRepository.updateStatus(jobId, 'accepted');
    } catch (error) {
      throw new InternalServerErrorException('Failed to apply for job');
    }
  }
}
