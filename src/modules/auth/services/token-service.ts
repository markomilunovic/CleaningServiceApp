import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { RefreshTokneEncodeType, ResetTokneEncodeType, VerificationTokneEncodeType } from '../utils/worker-types';
import { Worker } from 'modules/worker/models/worker.model';


@Injectable()
export class TokenService {
    constructor(private configService: ConfigService) {}

    createAccessToken(worker: Worker): string {
        const expiresIn = `${this.configService.get('ACCESS_TOKEN_EXP_TIME_IN_DAYS')}d`;
        return jwt.sign({ worker }, this.configService.get('ACCESS_TOKEN_SECRET'), { expiresIn });
    };

    createRefreshToken(refreshTokenEncode: RefreshTokneEncodeType): string {
        const expiresIn = `${this.configService.get('REFRESH_TOKEN_EXP_TIME_IN_DAYS')}d`;
        return jwt.sign({ refreshTokenEncode }, this.configService.get('REFRESH_TOKEN_SECRET'), { expiresIn });
    };

    createResetToken(resetTokenEncode: ResetTokneEncodeType): string {
        const expiresIn = `${this.configService.get<string>('RESET_TOKEN_EXP_TIME_IN_MINUTES')}d`;
        return jwt.sign({ resetTokenEncode }, this.configService.get<string>('RESET_TOKEN_SECRET'), { expiresIn });
    };

    createVerificationToken(verificationTokenEncode: VerificationTokneEncodeType): string {
        const expiresIn = `${this.configService.get<string>('VERIFICATION_TOKEN_EXP_TIME_IN_MINUTES')}d`;
        return jwt.sign({ verificationTokenEncode }, this.configService.get<string>('VERIFICATION_TOKEN_SECRET'), { expiresIn });
    };

    verifyResetToken(token: string): any  {
        return jwt.verify(token, this.configService.get<string>('RESET_TOKEN_SECRET'));
    };

    verifyVerificationToken(token: string): any  {
        return jwt.verify(token, this.configService.get<string>('VERIFICATION_TOKEN_SECRET'));
    };

};