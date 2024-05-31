import { BadRequestException, Body, Controller, Param, Put, Req, UploadedFiles, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { WorkerService } from '../services/worker.service';
import { EditWorkerDto } from '../dtos/edit-worker.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

let fileCount = 0; // Global counter to track file order

@Controller('worker')
export class WorkerController {
  constructor(private workerService: WorkerService) {}

  @Put('edit/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseInterceptors(FilesInterceptor('files', 2, {
    storage: diskStorage({
      destination: 'idCard_images',
      filename: (req, file, cb) => {
        const ext = extname(file.originalname);
        const id = req.params.id; 

        // Determine the label based on the file count
        const label = fileCount === 0 ? 'front' : 'back';
        fileCount++;

        cb(null, `${id}-${label}${ext}`);
      }
    })
  }))
  async editWorker(@Param('id') id: string, @UploadedFiles() files: Express.Multer.File[], @Body() editWorkerDto: EditWorkerDto): Promise<object> {
    try {
      let idCardPhotoFrontUrl = null;
      let idCardPhotoBackUrl = null;

      if (files.length === 2) {
        const [frontPhoto, backPhoto] = files;
        idCardPhotoFrontUrl = frontPhoto.path;
        idCardPhotoBackUrl = backPhoto.path;
      } else if (files.length === 1) {
        const [file] = files;
        if (fileCount === 1) {
          idCardPhotoFrontUrl = file.path;
        } else {
          idCardPhotoBackUrl = file.path;
        };
      };

      // Reset the fileCount after processing
      fileCount = 0;

      await this.workerService.editWorker(id, editWorkerDto, idCardPhotoFrontUrl, idCardPhotoBackUrl);
      
      return { message: 'Worker updated successfully' };
    } catch (error) {
      throw new BadRequestException('Error updating worker');
    };
  };
};
