import { Controller, Get, Post, Body, Patch, UsePipes, ValidationPipe, Query, UseGuards, HttpException, HttpStatus, Req, Param } from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDTO } from './dto/create-job.dto';
import { JwtUserGuard } from 'common/guards/jwt-user.guard';
import { Job } from './job.model';
import { JobQueryParamsDto } from './dto/job-query-params.dto';
import { JobApplicationDTO } from './dto/job-application.dto';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post('create')
  @UseGuards(JwtUserGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async createJob(@Body() createJobDTO: CreateJobDTO, @Req() req): Promise<Job> {
    try {
      const userId = req.user.id;
      return await this.jobService.createJob(createJobDTO, userId);
    } catch (error) {
      console.error('Error creating job:', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'An error occurred while creating the job',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('list')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getJobs(@Query() query: JobQueryParamsDto): Promise<{ rows: Job[]; count: number }> {
    try {
      return await this.jobService.findAll(query);
    } catch (error) {
      console.error('Error retrieving jobs:', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'An error occurred while retrieving the jobs',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id/apply')
  @UsePipes(new ValidationPipe({ transform: true }))
  async applyForJob(@Param('id') jobId: number, @Body() jobApplicationDTO: JobApplicationDTO): Promise<{ message: string }> {
    try {
      await this.jobService.applyForJob(jobId, jobApplicationDTO);
      return { message: 'Application successful' };
    } catch (error) {
      console.error('Error applying for job:', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'An error occurred while applying for the job',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id/confirm')
  @UseGuards(JwtUserGuard)
  async confirmJob(@Param('id') jobId: number, @Req() req): Promise<{ message: string }> {
    try {
      const userId = req.user.id;
      await this.jobService.confirmJob(jobId, userId);
      return { message: 'Job successfully confirmed' };
    } catch (error) {
      console.error('Error confirming job:', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'An error occurred while confirming the job',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
