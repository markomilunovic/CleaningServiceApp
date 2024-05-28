import { Module } from '@nestjs/common';
import { AuthWorkerController } from './controllers/authWorker.controller';
import { AuthWorkerService } from './services/authWorker.service';
import { AuthWorkerRepository } from './repositories/authWorker.repository';
import { GoogleWorkerStrategy } from './workerStrategies/googleWorker.strategy';
import { ConfigService } from '@nestjs/config';
import { FacebookWorkerStrategy } from './workerStrategies/facebookWorker.strategy';
import { WorkerTokenService } from './services/workerTokenService';

@Module({
    controllers: [AuthWorkerController],
    providers: [AuthWorkerService, 
                AuthWorkerRepository, 
                GoogleWorkerStrategy,
                FacebookWorkerStrategy, 
                ConfigService, 
                WorkerTokenService]
})
export class AuthModule {};

