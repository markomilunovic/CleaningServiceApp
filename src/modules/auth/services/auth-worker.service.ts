import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthWorkerRepository } from '../repositories/auth-worker.repository';
import { ConfirmWorkerEmailType, ForgotPasswordWorkerType, LoginWorkerType, RegisterWorkerType, ResetPasswordWorkerType, VerifyWorkerEmailType, WorkerNoPasswordType } from '../utils/worker-types';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { TokenService } from './token-service';
import { workerPasswordFilter } from '../utils/worker-password-filter.util';
import { EmailService } from './email.service';

@Injectable()
export class AuthWorkerService {
    constructor(
      private authWorkerRepository: AuthWorkerRepository,
      private configService: ConfigService,
      private tokenService: TokenService,
      private emailService: EmailService
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
            emailVerified: false,
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

        const accessTokenToken = this.tokenService.createAccessToken(worker);
        const refreshTokenToken = this.tokenService.createRefreshToken(refreshTokenEncode);

        const workerNoPassword = workerPasswordFilter(worker); 

        return { accessToken: accessTokenToken, refreshToken: refreshTokenToken, worker: workerNoPassword };

      };

      async forgotPassword(forgotPasswordWorkerType: ForgotPasswordWorkerType): Promise<void> {

        const { email } = forgotPasswordWorkerType;
        const worker = await this.authWorkerRepository.findWorkerByEmail(email);

        if (!worker) {
            throw new NotFoundException('Worker does not exist');
        };

        const resetTokenExpiresAt = new Date();
        resetTokenExpiresAt.setMinutes(resetTokenExpiresAt.getMinutes() + this.configService.get<number>('RESET_TOKEN_EXP_TIME_IN_MINUTES'));

        const resetToken = await this.authWorkerRepository.createResetToken(worker.id, resetTokenExpiresAt);

        const resetTokenEncode = {
            jti: resetToken.id,
            sub: email
        };

        const token = this.tokenService.createResetToken(resetTokenEncode);

        // Send the reset password link to the workers's email
        await this.emailService.sendResetPasswordEmail(email, token, worker.id);

      };

      async resetPassword(resetPasswordWorkerType: ResetPasswordWorkerType): Promise<void>{

        const { token, newPassword } = resetPasswordWorkerType;

        const decodedToken = this.tokenService.verifyResetToken(token);
        const email = decodedToken?.resetTokenEncode?.sub;
        const tokenId = decodedToken?.resetTokenEncode?.jti;

        if (typeof decodedToken === 'string') {
            throw new Error('Invalid token');
          };

        const resetToken = await this.authWorkerRepository.findResetTokenById(tokenId);
        const now = new Date();
        
        if (resetToken.expiresAt < now) {
            throw new BadRequestException('Reset token has expired');
        };

        const worker = await this.authWorkerRepository.findWorkerByEmail(email);

        if (!worker) {
            throw new NotFoundException('Worker does not exist');
        };

        // Check if the new password is different from the current password
        const passwordMatch = await bcrypt.compare(newPassword, worker.password);
        if (passwordMatch) {
            throw new BadRequestException('The new password cannot be same as the old one');
        };

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await this.authWorkerRepository.updateWorkerPassword(worker.id, hashedPassword);

        // Set the reset token as expired in the database
        await this.authWorkerRepository.setExpiredResetToken(tokenId);

      };

      async verifyEmail(VerifyWorkerEmailType: VerifyWorkerEmailType): Promise<void> {

        const { email } = VerifyWorkerEmailType;
        const worker = await this.authWorkerRepository.findWorkerByEmail(email);

        if (!worker) {
            throw new NotFoundException('Worker does not exist');
        };

        const verificationTokenExpiresAt = new Date();
        verificationTokenExpiresAt.setMinutes(verificationTokenExpiresAt.getMinutes() + this.configService.get<number>('VERIFICATION_TOKEN_EXP_TIME_IN_MINUTES'));

        const verificationToken = await this.authWorkerRepository.createVerificationToken(worker.id, verificationTokenExpiresAt);

        const verificationTokenEncode = {
            jti: verificationToken.id,
            sub: email
        };

        const token = this.tokenService.createVerificationToken(verificationTokenEncode);

        // Send the verification email link to the worker's email
        await this.emailService.sendVerifyEmail(email, token, worker.id);

      };

      async confirmEmail(confirmWorkerEmailType: ConfirmWorkerEmailType): Promise<void>{

        const { token } = confirmWorkerEmailType;

        const decodedToken = this.tokenService.verifyVerificationToken(token);
        const email = decodedToken?.verificationTokenEncode?.sub;
        const tokenId = decodedToken?.verificationTokenEncode?.jti;

        if (typeof decodedToken === 'string') {
            throw new Error('Invalid token');
          };

        const verificationToken = await this.authWorkerRepository.findVerificationTokenById(tokenId);
        const now = new Date();
        
        if (verificationToken.expiresAt < now) {
            throw new BadRequestException('Verification token has expired');
        };

        const worker = await this.authWorkerRepository.findWorkerByEmail(email);

        if (!worker) {
            throw new NotFoundException('Worker does not exist');
        };

        await this.authWorkerRepository.updateWorkerEmailStatus(worker.email);

        // Set the verification token as expired in the database
        await this.authWorkerRepository.setExpiredVerificationToken(tokenId);

      };
};
