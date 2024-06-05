import {
  Controller, Post, Body, BadRequestException, ConflictException,
  InternalServerErrorException, Put, Param, Get, UseGuards,
  Query, NotFoundException,
  UsePipes,
  ValidationPipe,
  Patch
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { EditUserDto } from './dtos/edit-user.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ConfirmResetPasswordDto } from './dtos/confirm-reset-password.dto';
import { JwtUserGuard } from 'common/guards/jwt-user.guard';
import { EmailVerificationService } from './email-verification.service';
import { Roles } from 'common/decorators/roles.decorator';
import { Worker } from 'modules/worker/models/worker.model';
import { RolesGuard } from 'common/guards/roles.guard';
import { Job } from 'modules/job/job.model';
import { ResponseDto } from 'common/dto/response.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { ApproveWorkerDto } from './dtos/approve-worker.dto';
import { ApproveJobDto } from './dtos/approve.job.dto';


@Controller('api/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly emailVerificationService: EmailVerificationService
  ) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.registerUser(createUserDto);
      return new ResponseDto(new UserResponseDto(user), 'User registered. Verification email sent.');
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  @Put(':id/edit')
  @UseGuards(JwtUserGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async editUser(@Param('id') id: number, @Body() editUserDto: EditUserDto) {
    try {
      const updatedUser = await this.userService.updateUser(id, editUserDto);
      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }
      return new ResponseDto(new UserResponseDto(updatedUser), 'User updated successfully');
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get('profile/:id')
  @UseGuards(JwtUserGuard)
  async getUser(@Param('id') id: number) {
    try {
      const user = await this.userService.findUserById(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return new ResponseDto(new UserResponseDto(user), 'User retrieved successfully');
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Post('forgot-password')
  @UsePipes(new ValidationPipe({ transform: true }))
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    try {
      await this.userService.generateResetToken(forgotPasswordDto.email);
      return new ResponseDto(null, 'Password reset token generated.');
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Post('confirm-reset-password')
  @UsePipes(new ValidationPipe({ transform: true }))
  async confirmResetPassword(@Query('token') token: string, @Body() confirmResetPasswordDto: ConfirmResetPasswordDto) {
    try {
      await this.userService.resetPassword(token, confirmResetPasswordDto.newPassword);
      return new ResponseDto(null, 'Password successfully reset.');
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Post('verify')
  async verifyEmail(@Query('token') token: string) {
    try {
      await this.emailVerificationService.verifyToken(token);
      return new ResponseDto(null, 'Email successfully verified.');
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get('workers')
  @UseGuards(JwtUserGuard, RolesGuard)
  @Roles('admin')
  async getAllWorkers(): Promise<Worker[]> {
    try {
      
      const workers = await this.userService.getAllWorkers();
      return workers;

    } catch (error) {
      throw new InternalServerErrorException('Error retrieving workers');
    };
  };


  @Patch('approve-worker')
  @UseGuards(JwtUserGuard, RolesGuard)
  @Roles('admin')
  async approveWorker(@Body() approveWorkerDto: ApproveWorkerDto): Promise<object> {

    try {

      await this.userService.approveWorker(approveWorkerDto);

      return { message: 'Worker approved successfully'};

    } catch (error) {
      throw new InternalServerErrorException('Error approving worker');
    };
  };

  @Get('jobs')
  @UseGuards(JwtUserGuard, RolesGuard)
  @Roles('admin')
  async getAllJobs(): Promise<Job[]> {
    try {
      
      const jobs = await this.userService.getAllJobs();
      return jobs;

    } catch (error) {
      throw new InternalServerErrorException('Error retrieving jobs');
    };
  };

  @Patch('approve-job')
  @UseGuards(JwtUserGuard, RolesGuard)
  @Roles('admin')
  async approveJob(@Body() approveJobDto: ApproveJobDto): Promise<object> {

    try {
      await this.userService.approveJob(approveJobDto);

      return { message: 'Job approved successfully' };

    } catch (error){
      throw new InternalServerErrorException('Error approving job');
    };
  };


};
