import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthWorkerRepository } from '../repositories/authWorker.repository';
import { LoginWorkerType, RegisterWorkerType, WorkerNoPasswordType } from '../utils/types';
import * as bcrypt from 'bcrypt';
import { Worker } from 'modules/worker/models/worker.model';
import { ConfigService } from '@nestjs/config';
import { WorkerTokenService } from './workerTokenService';
import { workerPasswordFilter } from '../utils/workerPasswordFilter.util';

@Injectable()
export class AuthWorkerService {
    constructor(
      private authWorkerRepository: AuthWorkerRepository,
      private configService: ConfigService,
      private workerTokenService: WorkerTokenService
    ) {}

    async registerWorker(registerWorkerType: RegisterWorkerType, frontPhotoPath: string, backPhotoPath: string): Promise<WorkerNoPasswordType> {
        
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

        return workerPasswordFilter(worker);
        
    };

    async registerOrLoginOauth2(email: string, firstName: string, lastName: string): Promise<WorkerNoPasswordType> {
        
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
    
        return workerPasswordFilter(worker);

      };


      async loginWorker(loginWorkerType: LoginWorkerType): Promise<{ accessToken: string; refreshToken: string; worker: WorkerNoPasswordType }> {

        const { email, password } = loginWorkerType;
        const worker = await this.authWorkerRepository.findWorkerByEmail(email);

        if (!worker) {
            throw new NotFoundException('Worker does not exist');
        };
    
        if(password) {
          
            const passwordMatch = await bcrypt.compare(password, worker.password);

            if (!passwordMatch) {
              throw new UnauthorizedException('Worng password');
            };
        };

        const accessTokenExpiresAt = new Date();
        accessTokenExpiresAt.setDate(accessTokenExpiresAt.getDate() + this.configService.get<number>('ACCESS_TOKEN_EXP_TIME_IN_DAYS'));

        const refreshTokenExpiresAt = new Date();
        refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + this.configService.get<number>('REFRESH_TOKEN_EXP_TIME_IN_DAYS'));

        const accessToken = await this.authWorkerRepository.createAccessToken(worker.id, accessTokenExpiresAt);
        const refreshToken = await this.authWorkerRepository.createRefreshToken(accessToken.id, refreshTokenExpiresAt);

        const refreshTokenEncode = {
            jti: refreshToken.id,
            sub: accessToken.id
          };

        const accessTokenToken = this.workerTokenService.createAccessToken(worker);
        const refreshTokenToken = this.workerTokenService.createRefreshToken(refreshTokenEncode);

        const workerNoPassword = workerPasswordFilter(worker); 

        return { accessToken: accessTokenToken, refreshToken: refreshTokenToken, worker: workerNoPassword };

      };
};
