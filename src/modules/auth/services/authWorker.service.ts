import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthWorkerRepository } from '../repositories/authWorker.repository';
import { RegisterWorkerType, RegisteredWorkerType } from '../utils/types';
import * as bcrypt from 'bcrypt';
import { Worker } from 'modules/worker/worker.model';

@Injectable()
export class AuthWorkerService {
    constructor(private authWorkerRepository: AuthWorkerRepository) {}

    async registerWorker(registerWorkerType: RegisterWorkerType, frontPhotoPath: string, backPhotoPath: string): Promise<RegisteredWorkerType> {
        
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

        return this.mapWorkerToRegisteredWorker(worker);
        
    };

    async registerOrLoginWithGoogle(email: string, firstName: string, lastName: string): Promise<RegisteredWorkerType> {
        
        let worker = await this.authWorkerRepository.findWorkerByEmail(email);
    
        if (!worker) {
          // If worker doesn't exist, create a new one
          const workerData = {
            firstName,
            lastName,
            email,
            password: '', 
            idCardPhotoFrontUrl: '',
            idCardPhotoBackUrl: '',
            cities: [], 
            municipalities: [], 
            hourlyRate: 0, 
            emailVerified: true,
            verifiedByAdmin: false,
            termsAccepted: false
          };
    
          worker = await this.authWorkerRepository.register(workerData, '', '');
        };
    
        return this.mapWorkerToRegisteredWorker(worker);

      };
    
      private mapWorkerToRegisteredWorker(worker: Worker): RegisteredWorkerType {
        return {
          id: worker.id,
          firstName: worker.firstName,
          lastName: worker.lastName,
          email: worker.email,
          cities: worker.cities,
          municipalities: worker.municipalities,
          hourlyRate: worker.hourlyRate,
          idCardPhotoFrontUrl: worker.idCardPhotoFrontUrl,
          idCardPhotoBackUrl: worker.idCardPhotoBackUrl,
          emailVerified: worker.emailVerified,
          verifiedByAdmin: worker.verifiedByAdmin,
          termsAccepted: worker.termsAccepted
        };

      };
};
