import { Injectable } from '@nestjs/common';
import { RegisterWorkerType } from '../utils/types';
import { Worker } from 'modules/worker/models/worker.model';
import { AccessToken } from '../models/accessToken.model';
import { RefreshToken } from '../models/refreshToken.model';

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

        const token = await AccessToken.create({ worker_id: workerId, expires_at: accessTokenExpiresAt });

        return token;
        
   };

   async createRefreshToken(accessTokenId: string, refreshTokenExpiresAt: Date): Promise<RefreshToken> {

       const token = await RefreshToken.create({ access_token_id: accessTokenId, expires_at: refreshTokenExpiresAt });

       return token;
       
  };

};
