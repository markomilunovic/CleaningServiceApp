import { Controller, Post, Body, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDTO } from './dto/create-job.dto';
import { Job } from './job.model';
import { JwtAuthGuard } from 'common/guards/jwt-auth.guard';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post('create')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createJob(@Body() createJobDTO: CreateJobDTO): Promise<Job> {
    return this.jobService.createJob(createJobDTO);
  }
}
