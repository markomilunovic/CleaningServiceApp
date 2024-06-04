import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Job } from './job.model';
import { CreateJobDTO } from './dto/create-job.dto';

@Injectable()
export class JobRepository {
  constructor(@InjectModel(Job) private jobModel: typeof Job) {}

  async create(createJobDTO: CreateJobDTO): Promise<Job> {
    return this.jobModel.create(createJobDTO);
  }
}
