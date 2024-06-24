import * as bcrypt from 'bcrypt';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { WorkerRepository } from '../repositories/worker.repository';
import { EditWorkerType } from '../utils/types';
import { Worker } from '../models/worker.model';

@Injectable()
export class WorkerService {
  constructor(private workerRepository: WorkerRepository) {}

  async editWorker(id: string, editWorkerType: EditWorkerType, idCardPhotoFrontUrl?: string, idCardPhotoBackUrl?: string): Promise<Worker> {
    if (editWorkerType.password) {
      const hashedPassword = await bcrypt.hash(editWorkerType.password, 10);
      editWorkerType.password = hashedPassword;
    };

    if (idCardPhotoFrontUrl) {
      editWorkerType.idCardPhotoFrontUrl = idCardPhotoFrontUrl;
    };
    if (idCardPhotoBackUrl) {
      editWorkerType.idCardPhotoBackUrl = idCardPhotoBackUrl;
    };

    const worker = await this.workerRepository.editWorker(id, editWorkerType);

    if (!worker) {
      throw new NotFoundException('Worker not found');
    }

    return worker;
  };

  async findWorkerById(id: number): Promise<Worker> {
    try {
      const worker = await this.workerRepository.findWorkerById(id);
      if (!worker) {
        throw new NotFoundException('Worker not found.');
      }
      return worker;
    } catch (error) {
      throw new InternalServerErrorException('Error finding worker.');
    }
  }
};
