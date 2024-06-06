import { BadRequestException, Body, Controller, Param, Put, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { WorkerService } from '../services/worker.service';
import { EditWorkerDto } from '../dtos/edit-worker.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ResponseDto } from 'common/dto/response.dto';
import { JwtWorkerGuard } from 'common/guards/jwt-worker.guard';

let fileCount = 0; // Global counter to track file order

@Controller('worker')
export class WorkerController {
  constructor(private workerService: WorkerService) {}

  @Put('edit/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseGuards(JwtWorkerGuard)
  @UseInterceptors(FilesInterceptor('files', 2))
  async editWorker(@Param('id') id: string, @UploadedFiles() files: Express.Multer.File[], @Body() editWorkerDto: EditWorkerDto): Promise<ResponseDto<null>> {
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
      
      return new ResponseDto(null, 'Worker updated successfully');
      
    } catch (error) {
      throw new BadRequestException('Error updating worker');
    };
  };

};
