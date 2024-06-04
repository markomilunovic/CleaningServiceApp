import { Controller, Get, Post, Body, UsePipes, ValidationPipe, Query, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDTO } from './dto/create-job.dto';
import { Job } from './job.model';
import { JwtAuthGuard } from 'common/guards/jwt-auth.guard';
import { JobListDto } from './dto/job-list.dto';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async createJob(@Body() createJobDTO: CreateJobDTO): Promise<Job> {
    try {
      return await this.jobService.createJob(createJobDTO);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'An error occurred while creating the job',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async getJobs(@Query() query: JobListDto): Promise<{ rows: Job[]; count: number }> {
    try {
      return await this.jobService.findAll(query);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'An error occurred while retrieving the jobs',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
