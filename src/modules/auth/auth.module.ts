import { Module } from '@nestjs/common';
import { AuthWorkerController } from './controllers/auth.controller';
import { AuthWorkerService } from './services/authWorker.service';
import { AuthWorkerRepository } from './repositories/authWorker.repository';

@Module({
    controllers: [AuthWorkerController],
    providers: [AuthWorkerService, AuthWorkerRepository]
})
export class AuthModule {};
