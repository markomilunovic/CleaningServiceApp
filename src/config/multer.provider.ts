import { ConfigService } from '@nestjs/config';
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';
import { Injectable } from '@nestjs/common';
import { multerConfigFactory } from './multer.config';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
    
  constructor(private readonly configService: ConfigService) {}

  createMulterOptions(): MulterModuleOptions {
    return {
      ...multerConfigFactory(this.configService),
    };
  };
};
