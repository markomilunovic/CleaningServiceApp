import { Controller, Post, Body, Get, UseGuards, Req, UnauthorizedException, UsePipes, ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { AuthUserService } from '../services/auth-user.service';
import { LoginUserDto } from '../dtos/user/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { LoginUserResponseDto } from '../dtos/user/login-user-response.dto';
import { ResponseDto } from 'common/dto/response.dto';

@Controller('auth-user')
export class AuthUserController {
  constructor(private readonly authUserService: AuthUserService) {}

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(@Body() loginUserDto: LoginUserDto): Promise<ResponseDto<LoginUserResponseDto>> {
    try {
      const user = await this.authUserService.validateUser(loginUserDto.email, loginUserDto.password);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const authResponse = await this.authUserService.login(user);
      return new ResponseDto(new LoginUserResponseDto(authResponse), 'Login successful');
    } catch (error) {
      console.error('Error during login:', error);
      throw new HttpException(
        {
          success: false,
          message: 'An error occurred during login',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('google')
  @UseGuards(AuthGuard('google-user'))
  async googleAuth(@Req() req): Promise<void> {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google-user'))
  async googleAuthRedirect(@Req() req): Promise<ResponseDto<LoginUserResponseDto>> {
    try {
      if (!req.user) {
        throw new UnauthorizedException('No user data from Google');
      }
      const authResponse = await this.authUserService.login(req.user);
      return new ResponseDto(new LoginUserResponseDto(authResponse), 'Google login successful');
    } catch (error) {
      console.error('Error during Google login:', error);
      throw new HttpException(
        {
          success: false,
          message: 'An error occurred during Google login',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook-user'))
  async facebookAuth(@Req() req): Promise<void> {}

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook-user'))
  async facebookAuthRedirect(@Req() req): Promise<ResponseDto<LoginUserResponseDto>> {
    try {
      if (!req.user) {
        throw new UnauthorizedException('No user data from Facebook');
      }
      const authResponse = await this.authUserService.login(req.user);
      return new ResponseDto(new LoginUserResponseDto(authResponse), 'Facebook login successful');
    } catch (error) {
      console.error('Error during Facebook login:', error);
      throw new HttpException(
        {
          success: false,
          message: 'An error occurred during Facebook login',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
