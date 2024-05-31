import { Injectable } from '@nestjs/common';
import { Worker } from '../models/worker.model';
import { EditWorkerType } from '../utils/types';

@Injectable()
export class WorkerRepository {
  async editWorker(id: string, editWorkerType: EditWorkerType): Promise<Worker> {

    const worker = await Worker.findByPk(id);
    
    await worker.update(editWorkerType);

    return worker;
  };
};
