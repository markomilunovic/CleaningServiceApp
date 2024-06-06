import { Controller, Post, Body, Get, UseGuards, Req, UnauthorizedException, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthUserService } from '../services/auth-user.service';
import { LoginUserDto } from '../dtos/user/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { LoginUserResponseDto } from '../dtos/user/login-user-response.dto';

@Controller('auth-user')
export class AuthUserController {
  constructor(private readonly authUserService: AuthUserService) {}

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(@Body() loginUserDto: LoginUserDto): Promise<LoginUserResponseDto> {
    const user = await this.authUserService.validateUser(loginUserDto.email, loginUserDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const authResponse = await this.authUserService.login(user);
    return new LoginUserResponseDto(authResponse);
  }

  @Get('google')
  @UseGuards(AuthGuard('google-user'))
  async googleAuth(@Req() req): Promise<void> {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google-user'))
  async googleAuthRedirect(@Req() req): Promise<LoginUserResponseDto> {
    if (!req.user) {
      throw new UnauthorizedException('No user data from Google');
    }
    const authResponse = await this.authUserService.login(req.user);
    return new LoginUserResponseDto(authResponse);
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook-user'))
  async facebookAuth(@Req() req): Promise<void> {}

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook-user'))
  async facebookAuthRedirect(@Req() req): Promise<LoginUserResponseDto> {
    if (!req.user) {
      throw new UnauthorizedException('No user data from Facebook');
    }
    const authResponse = await this.authUserService.login(req.user);
    return new LoginUserResponseDto(authResponse);
  }
}
