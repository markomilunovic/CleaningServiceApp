import { diskStorage } from 'multer';
import { extname } from 'path';
import { ConfigService } from '@nestjs/config';

let fileCount = 0; // Global counter to track file order


export const multerConfigFactory = (configService: ConfigService) => ({
    storage: diskStorage({
      destination: configService.get<string>('UPLOADS_DIRECTORY'),
      filename: (req, file, cb) => {
        const ext = extname(file.originalname);
        const email = req.body.email;
  
        // Determine the label based on the file count
        const label = fileCount === 0 ? 'front' : 'back';
        fileCount++;
  
        cb(null, `${email}-${label}${ext}`);
      },
    }),
  });
  