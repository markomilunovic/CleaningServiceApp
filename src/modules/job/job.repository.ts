import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Job } from './job.model';
import { CreateJobDTO } from './dto/create-job.dto';
import { JobListDto } from './dto/job-list.dto';
import { Op } from 'sequelize';

@Injectable()
export class JobRepository {
  constructor(@InjectModel(Job) private jobModel: typeof Job) {}

  async create(createJobDTO: CreateJobDTO): Promise<Job> {
    try {
      return await this.jobModel.create(createJobDTO);
    } catch (error) {
      throw new InternalServerErrorException('Database error occurred while creating job');
    }
  }

  async findAll(query: JobListDto): Promise<{ rows: Job[]; count: number }> {
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
      throw new InternalServerErrorException('Database error occurred while retrieving jobs');
    }
  }
}
