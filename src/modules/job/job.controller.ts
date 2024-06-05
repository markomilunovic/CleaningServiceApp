import { Controller, Get, Post, Body, Patch, UsePipes, ValidationPipe, Query, UseGuards, HttpException, HttpStatus, Req, Param } from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDTO } from './dto/create-job.dto';
import { JwtUserGuard } from 'common/guards/jwt-user.guard';
import { JobQueryParamsDto } from './dto/job-query-params.dto';
import { JobApplicationDTO } from './dto/job-application.dto';
import { ResponseDto } from 'common/dto/response.dto';
import { JobResponseDto } from './dto/job-response.dto';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post('create')
  @UseGuards(JwtUserGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async createJob(@Body() createJobDTO: CreateJobDTO, @Req() req): Promise<ResponseDto<JobResponseDto>> {
    try {
      const userId = req.user.id;
      const job = await this.jobService.createJob(createJobDTO, userId);
      return new ResponseDto(new JobResponseDto(job), 'Job created successfully');
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
  async getJobs(@Query() query: JobQueryParamsDto): Promise<ResponseDto<{ rows: JobResponseDto[]; count: number }>> {
    try {
      const { rows, count } = await this.jobService.findAll(query);
      return new ResponseDto({ rows: rows.map(job => new JobResponseDto(job)), count }, 'Jobs retrieved successfully');
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
  async applyForJob(@Param('id') jobId: number, @Body() jobApplicationDTO: JobApplicationDTO): Promise<ResponseDto<{ message: string }>> {
    try {
      await this.jobService.applyForJob(jobId, jobApplicationDTO);
      return new ResponseDto({ message: 'Application successful' }, 'Job application submitted successfully');
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
  async confirmJob(@Param('id') jobId: number, @Req() req): Promise<ResponseDto<{ message: string }>> {
    try {
      const userId = req.user.id;
      await this.jobService.confirmJob(jobId, userId);
      return new ResponseDto({ message: 'Job successfully confirmed' }, 'Job confirmation successful');
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
