import { Controller, Post, Body, Get, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { AuthUserService } from '../services/auth-user.service';
import { LoginDto } from '../dtos/user/login-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth-user')
export class AuthUserController {
  constructor(private readonly authService: AuthUserService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Get('google')
  @UseGuards(AuthGuard('google-user'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google-user'))
  async googleAuthRedirect(@Req() req) {
    if (!req.user) {
      throw new UnauthorizedException('No user data from Google');
    }
    return this.authService.login(req.user);
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook-user'))
  async facebookAuth(@Req() req) {}

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook-user'))
  async facebookAuthRedirect(@Req() req) {
    if (!req.user) {
      throw new UnauthorizedException('No user data from Facebook');
    }
    return this.authService.login(req.user);
  }
}
