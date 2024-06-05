import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Job } from './job.model';
import { CreateJobDTO } from './dto/create-job.dto';
import { JobQueryParamsDto } from './dto/job-query-params.dto';
import { Op } from 'sequelize';

@Injectable()
export class JobRepository {
  constructor(@InjectModel(Job) private jobModel: typeof Job) {}

  async create(createJobDTO: CreateJobDTO): Promise<Job> {
    try {
      return await this.jobModel.create(createJobDTO);
    } catch (error) {
      console.error('Database error while creating job:', error);
      throw new InternalServerErrorException('Database error occurred while creating job');
    }
  }

  async findAll(query: JobQueryParamsDto): Promise<{ rows: Job[]; count: number }> {
    let { page = 1, limit = 10, municipality, address, search, sortBy = 'createdAt', sortOrder = 'DESC' } = query;

    const offset = (page - 1) * limit;
    const where: any = {};

    if (municipality) {
      where.municipality = municipality;
    }

    if (address) {
      where.address = address;
    }

    if (search) {
      where.address = {
        [Op.like]: `%${search}%`,
      };
    }

    try {
      const { rows, count } = await this.jobModel.findAndCountAll({
        where,
        limit,
        offset,
        order: [[sortBy, sortOrder]],
      });

      return { rows, count };
    } catch (error) {
      console.error('Database error while retrieving jobs:', error);
      throw new InternalServerErrorException('Database error occurred while retrieving jobs');
    }
  }

  async findById(jobId: number): Promise<Job> {
    try {
      return await this.jobModel.findByPk(jobId);
    } catch (error) {
      console.error('Database error while finding job by ID:', error);
      throw new InternalServerErrorException('Database error occurred while finding job by ID');
    }
  }

  async updateStatus(jobId: number, status: string, workerId?: number): Promise<void> {
    try {
      const job = await this.jobModel.findByPk(jobId);
      if (!job) {
        throw new BadRequestException('Job not found');
      }
      job.status = status;
      if (workerId !== undefined) {
        job.workerId = workerId;
      }
      await job.save();
    } catch (error) {
      console.error('Failed to update job status:', error);
      throw new InternalServerErrorException('Failed to update job status');
    }
  }
}
