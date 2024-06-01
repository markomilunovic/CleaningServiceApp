import { Controller, Post, Body, Get, UseGuards, Req, UnauthorizedException, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthUserService } from '../services/auth-user.service';
import { LoginUserDto } from '../dtos/user/login-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth-user')
export class AuthUserController {
  constructor(private readonly authUserService: AuthUserService) {}

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.authUserService.validateUser(loginUserDto.email, loginUserDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authUserService.login(user);
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
    return this.authUserService.login(req.user);
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
    return this.authUserService.login(req.user);
  }
}