import { BadRequestException, Body, Controller, InternalServerErrorException, Post, UploadedFiles, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthWorkerService } from '../services/authWorker.service';
import { RegisterWorkerDto } from '../dtos/registerWorker.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

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
};
