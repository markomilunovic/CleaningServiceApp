import { Injectable } from '@nestjs/common';
import { RegisterWorkerType } from '../utils/types';
import { Worker } from 'modules/worker/worker.model';

@Injectable()
export class AuthWorkerRepository {

    async register(registerWorkerType: RegisterWorkerType, frontPhotoPath: string, backPhotoPath: string): Promise<Worker> {
        return Worker.create({
            ...registerWorkerType,
            idCardPhotoFrontUrl: frontPhotoPath,
            idCardPhotoBackUrl: backPhotoPath
        });
    };

    async findWorkerByEmail(email: string): Promise<Worker | null> {
        return Worker.findOne({ where: { email } });
    };

};
