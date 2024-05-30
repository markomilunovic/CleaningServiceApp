import { BadRequestException, Body, Controller, Get, HttpException, HttpStatus, InternalServerErrorException, Post, Req, UnauthorizedException, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthWorkerService } from '../services/authWorker.service';
import { RegisterWorkerDto } from '../dtos/registerWorker.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from '@nestjs/passport';
import { LoginWorkerDto } from '../dtos/loginWorker.dto';

let fileCount = 0; // Global counter to track file order

@Controller('auth')
export class AuthWorkerController {

    constructor(private authWorkerService: AuthWorkerService) {}

    @Post('worker/register')
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
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) {};

    @Get('google/redirect')
    @UseGuards(AuthGuard('google'))
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
    @UseGuards(AuthGuard('facebook'))
    async facebookAuth(@Req() req) {}

    @Get('facebook/redirect')
    @UseGuards(AuthGuard('facebook'))
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

    @Post('worker/login')
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


};


