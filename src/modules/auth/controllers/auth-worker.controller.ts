import { BadRequestException, Body, Controller, Get, HttpException, HttpStatus, InternalServerErrorException, Post, Req, UnauthorizedException, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthWorkerService } from '../services/auth-worker.service';
import { RegisterWorkerDto } from '../dtos/worker/register-worker.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from '@nestjs/passport';
import { LoginWorkerDto } from '../dtos/worker/login-worker.dto';
import { ForgotPasswordWorkerDto } from '../dtos/worker/forgot-password-worker.dto';
import { ResetPasswordWorkerDto } from '../dtos/worker/reset-password-worker.dto';
import { VerifyWorkerEmailDto } from '../dtos/worker/verify-worker-email.dto';
import { ConfirmWorkerEmailDto } from '../dtos/worker/confirm-worker-email.dto';

let fileCount = 0; // Global counter to track file order

@Controller('auth-worker')
export class AuthWorkerController {

    constructor(private authWorkerService: AuthWorkerService) {}

    @Post('register')
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    @UseInterceptors(FilesInterceptor('files', 2, {
        storage: diskStorage({
            destination: 'idCard_images',
            filename: (req, file, cb) => {
                const ext = extname(file.originalname);
                const email = req.body.email; 

                // Determine the label based on the file count
                const label = fileCount === 0 ? 'front' : 'back';
                fileCount++;

                cb(null, `${email}-${label}${ext}`);
            }
        })
    }))
    async registerWorker(@UploadedFiles() files: Express.Multer.File[], @Body() registerWorkerDto: RegisterWorkerDto): Promise<object> {
      console.log('registerWorker - registerWorkerDto:', registerWorkerDto);
        try{

            if (files.length !== 2) {
                throw new BadRequestException('Both front and back photos are required');
            };

            const [idCardPhotoFront, idCardPhotoBack] = files;

            const worker = await this.authWorkerService.registerWorker(registerWorkerDto, idCardPhotoFront.path, idCardPhotoBack.path);

            return { message: 'Worker registered successfully', worker };
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            };
            console.log(error);
            throw new InternalServerErrorException('Error registering worker');
        };
    };


    @Get('google')
    @UseGuards(AuthGuard('google-worker'))
    async googleAuth(@Req() req) {};

    @Get('google/callback')
    @UseGuards(AuthGuard('google-worker'))
    async googleAuthRedirect(@Req() req) {
        if (!req.user) {
            throw new UnauthorizedException('No worker data from Google');
        };

        const loginWorkerType = {
            email: req.user.email,
            password: null // No password for OAuth logins
        };

        const { accessToken, refreshToken, worker } = await this.authWorkerService.loginWorker(loginWorkerType);
        return {
            message: 'Google authentication successful',
            accessToken,
            refreshToken,
            worker
        };
    };

    @Get('facebook')
    @UseGuards(AuthGuard('facebook-worker'))
    async facebookAuth(@Req() req) {}

    @Get('facebook/callback')
    @UseGuards(AuthGuard('facebook-worker'))
    async facebookAuthRedirect(@Req() req) {
      if (!req.user) {
        throw new UnauthorizedException('No worker data from Google');
    };

    const loginWorkerType = {
        email: req.user.email,
        password: null // No password for OAuth logins
    };

    const { accessToken, refreshToken, worker } = await this.authWorkerService.loginWorker(loginWorkerType);
    return {
        message: 'Facebook authentication successful',
        accessToken,
        refreshToken,
        worker
    };
    };

    @Post('login')
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async loginWorker(@Body() loginWorkerDto: LoginWorkerDto): Promise<{ accessToken: string; refreshToken: string; worker: object }> {
      console.log('loginWorker - loginWorkerDto:', loginWorkerDto);
      try {

        const {accessToken, refreshToken, worker } = await this.authWorkerService.loginWorker(loginWorkerDto);
        return { accessToken, refreshToken, worker };

      } catch (error) {
        throw new HttpException('Error logging in', HttpStatus.INTERNAL_SERVER_ERROR);
      };

    };

    @Post('forgot-password')
    @UsePipes(new ValidationPipe( {whitelist: true, forbidNonWhitelisted: true}))
    async forgotPassword(@Body() forgotPasswordWorkerDto: ForgotPasswordWorkerDto): Promise<object> {

        try{

            await this.authWorkerService.forgotPassword(forgotPasswordWorkerDto);
            return { message: 'Reset password link sent to your email' }

        } catch(error) {
            throw new HttpException('Failed to process forgot password request', HttpStatus.INTERNAL_SERVER_ERROR);
        };
    };

    @Post('reset-password')
    @UsePipes(new ValidationPipe( {whitelist: true, forbidNonWhitelisted: true}))
    async resetPassword(@Body() resetPasswordWorkerDto: ResetPasswordWorkerDto): Promise<object> {

        try{
            await this.authWorkerService.resetPassword(resetPasswordWorkerDto);
            return { message: 'Password reset successful' };
        } catch(error) {
            console.log(error)
            throw new HttpException('Failed to reset password', HttpStatus.INTERNAL_SERVER_ERROR);
        };
    };

    @Post('verify-email')
    @UsePipes(new ValidationPipe( {whitelist: true, forbidNonWhitelisted: true}))
    async verifyEmail(@Body() verifyWorkerEmailDto: VerifyWorkerEmailDto): Promise<object> {

        try{

            await this.authWorkerService.verifyEmail(verifyWorkerEmailDto);
            return { message: 'Email verification link sent to your email' }

        } catch(error) {
            throw new HttpException('Failed to process email verification request', HttpStatus.INTERNAL_SERVER_ERROR);
        };
    };

    @Post('confirm-email')
    @UsePipes(new ValidationPipe( {whitelist: true, forbidNonWhitelisted: true}))
    async confirmEmail(@Body() confirmWorkerEmailDto: ConfirmWorkerEmailDto): Promise<object> {

        try{
            await this.authWorkerService.confirmEmail(confirmWorkerEmailDto);
            return { message: 'Email verification successful' };
        } catch(error) {
            console.log(error)
            throw new HttpException('Failed to verify email', HttpStatus.INTERNAL_SERVER_ERROR);
        };
    };


};


