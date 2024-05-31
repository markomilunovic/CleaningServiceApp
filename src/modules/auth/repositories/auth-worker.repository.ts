import { Injectable } from '@nestjs/common';
import { RegisterWorkerType } from '../utils/types';
import { Worker } from 'modules/worker/models/worker.model';
import { AccessToken } from '../models/access-token.model';
import { RefreshToken } from '../models/refresh-token.model';

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

    async createAccessToken(workerId: number, accessTokenExpiresAt: Date): Promise<AccessToken> {

        const token = await AccessToken.create({ workerId: workerId, expiresAt: accessTokenExpiresAt });

        return token;
        
   };

   async createRefreshToken(accessTokenId: string, refreshTokenExpiresAt: Date): Promise<RefreshToken> {

       const token = await RefreshToken.create({ accessTokenId: accessTokenId, expiresAt: refreshTokenExpiresAt });

       return token;
       
  };

};