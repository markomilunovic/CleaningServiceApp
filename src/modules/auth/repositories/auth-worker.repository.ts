import { Injectable } from '@nestjs/common';
import { RegisterWorkerType } from '../utils/worker-types';
import { Worker } from 'modules/worker/models/worker.model';
import { AccessToken } from '../models/access-token.model';
import { RefreshToken } from '../models/refresh-token.model';
import { ResetToken } from '../models/reset-token.model';
import { VerificationToken } from '../models/verification-token.model';

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

    async findWorkerById(id: number): Promise<Worker | null> {
        return Worker.findOne({ where: { id } });
    };

    async createAccessToken(workerId: number, accessTokenExpiresAt: Date): Promise<AccessToken> {

        const token = await AccessToken.create({ workerId: workerId, expiresAt: accessTokenExpiresAt });

        return token;
        
    };

   async createRefreshToken(accessTokenId: string, refreshTokenExpiresAt: Date): Promise<RefreshToken> {

       const token = await RefreshToken.create({ accessTokenId: accessTokenId, expiresAt: refreshTokenExpiresAt });

       return token;
       
    };

    async createResetToken(workerId: number, resetTokenExpiresAt: Date): Promise<ResetToken> {

       const token = await ResetToken.create({ workerId: workerId, expiresAt: resetTokenExpiresAt });

       return token;

    };

    async createVerificationToken(workerId: number, verificationTokenExpiresAt: Date): Promise<VerificationToken> {

        const token = await VerificationToken.create({ workerId: workerId, expiresAt: verificationTokenExpiresAt });
 
        return token;
 
     };

    async updateWorkerPassword(workerId: number, newPassword: string): Promise<void> {

       await Worker.update( {password: newPassword}, { where: { id: workerId }});

    };

    async setExpiredResetToken(tokenId: string): Promise<void> {

       await ResetToken.update({ expiresAt: new Date(), isRevoked: true },  { where: { id: tokenId } });

    };

    async setExpiredVerificationToken(tokenId: string): Promise<void> {

        await VerificationToken.update({ expiresAt: new Date(), isRevoked: true },  { where: { id: tokenId } });
 
     };

    async findResetTokenById(tokenId: string): Promise<ResetToken | null> {

        return ResetToken.findOne({ where: { id: tokenId } });

    };

    async findVerificationTokenById(tokenId: string): Promise<VerificationToken | null> {

        return VerificationToken.findOne({ where: { id: tokenId } });
    };


    async updateWorkerEmailStatus(email: string): Promise<void> {

        await Worker.update({ emailVerified: true }, { where: { email: email } })
    };

};
