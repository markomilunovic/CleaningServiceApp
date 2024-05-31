import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthWorkerRepository } from '../repositories/authWorker.repository';
import { RegisterWorkerType, registeredWorkerType } from '../utils/types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthWorkerService {
    constructor(private authWorkerRepository: AuthWorkerRepository) {}

    async registerWorker(registerWorkerType: RegisterWorkerType, frontPhotoPath: string, backPhotoPath: string): Promise<registeredWorkerType> {
        
        const { email, password } = registerWorkerType;

        if (await this.authWorkerRepository.findWorkerByEmail(email)) {
            throw new BadRequestException('User already exists');
        };

        const hashedPassword = await bcrypt.hash(password, 10);

        const workerData: RegisterWorkerType = {
            ...registerWorkerType,
            password: hashedPassword
        };

        const worker = await this.authWorkerRepository.register(workerData, frontPhotoPath, backPhotoPath);

        const registeredWorker = {
            id: worker.id,
            firstName: worker.firstName,
            lastName: worker.lastName,
            email: worker.password,
            cities: worker.cities,
            municipalities: worker.municipalities,
            hourlyRate: worker.hourlyRate,
            idCardPhotoFrontUrl: worker.idCardPhotoFrontUrl,
            idCardPhotoBackUrl: worker.idCardPhotoBackUrl,
            emailVerified : worker.emailVerified,
            verifiedByAdmin: worker.verifiedByAdmin,
            termsAccepted: worker.termsAccepted
        };

        return registeredWorker;
        
    };
};
