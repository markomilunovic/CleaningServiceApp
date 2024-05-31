import {
  Controller, Post, Body, BadRequestException, ConflictException,
  InternalServerErrorException, Put, Param, Get, UseGuards,
  Query, NotFoundException
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { EditUserDto } from './dtos/edit-user.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ConfirmResetPasswordDto } from './dtos/confirm-reset-password.dto';
import { JwtAuthGuard } from 'common/guards/jwt-auth.guard';
import { EmailVerificationService } from './email-verification.service';

@Controller('api/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly emailVerificationService: EmailVerificationService
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.registerUser(createUserDto);
      return { message: 'User registered. Verification email sent.' };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  @Put('edit/:id')
  @UseGuards(JwtAuthGuard)
  async editUser(@Param('id') id: number, @Body() editUserDto: EditUserDto) {
    try {
      const updatedUser = await this.userService.updateUser(id, editUserDto);
      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }
      return updatedUser;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUser(@Param('id') id: number) {
    try {
      const user = await this.userService.findUserById(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    try {
      await this.userService.generateResetToken(forgotPasswordDto.email);
      return { message: 'Password reset token generated.' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Post('confirm-reset-password')
  async confirmResetPassword(@Query('token') token: string, @Body() confirmResetPasswordDto: ConfirmResetPasswordDto) {
    try {
      await this.userService.resetPassword(
        token,
        confirmResetPasswordDto.newPassword,
      );
      return { message: 'Password successfully reset.' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Post('verify')
  async verifyEmail(@Query('token') token: string) {
    try {
      await this.emailVerificationService.verifyToken(token);
      return { message: 'Email successfully verified.' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
