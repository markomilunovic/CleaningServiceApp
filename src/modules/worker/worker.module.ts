import { Module } from '@nestjs/common';
import { WorkerController } from './controllers/worker.controller';
import { WorkerService } from './services/worker.service';
import { WorkerRepository } from './repositories/worker.repository';

@Module({
    controllers: [WorkerController],
    providers: [WorkerService, WorkerRepository]
})
export class WorkerModule {};
