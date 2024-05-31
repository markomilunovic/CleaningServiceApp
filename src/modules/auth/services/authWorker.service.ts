import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthWorkerRepository } from '../repositories/authWorker.repository';
import { LoginWorkerType, RegisterWorkerType, RegisteredWorkerType } from '../utils/types';
import * as bcrypt from 'bcrypt';
import { Worker } from 'modules/worker/worker.model';
import { ConfigService } from '@nestjs/config';
import { WorkerTokenService } from './workerTokenService';

@Injectable()
export class AuthWorkerService {
    constructor(
      private authWorkerRepository: AuthWorkerRepository,
      private configService: ConfigService,
      private workerTokenService: WorkerTokenService
    ) {}

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

      async loginWorker(loginWorkerType: LoginWorkerType): Promise<{ accessToken: string; refreshToken: string; worker: Worker }> {

        const { email, password } = loginWorkerType;
        const worker = await this.authWorkerRepository.findWorkerByEmail(email);

        if (!worker) {
            throw new NotFoundException('Worker does not exist');
        };
    
        const passwordMatch = await bcrypt.compare(password, worker.password);

        if (!passwordMatch) {
          throw new UnauthorizedException('Worng password');
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
    
        return { accessToken: accessTokenToken, refreshToken: refreshTokenToken, worker };

      };
};
