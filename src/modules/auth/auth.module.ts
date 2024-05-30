import { Module } from '@nestjs/common';
import { AuthWorkerController } from './controllers/authWorker.controller';
import { AuthWorkerService } from './services/authWorker.service';
import { WorkerTokenService } from './services/workerTokenService';
import { AuthWorkerRepository } from './repositories/authWorker.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { Worker } from 'modules/worker/models/worker.model';
import { AccessToken } from './models/accessToken.model';
import { RefreshToken } from './models/refreshToken.model';
import { ResetToken } from './models/resetToken.model';
import { VerificationToken } from './models/verificationToken.model';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { GoogleWorkerStrategy } from './workerStrategies/googleWorker.strategy';
import { FacebookWorkerStrategy } from './workerStrategies/facebookWorker.strategy';

@Module({
  imports: [
    SequelizeModule.forFeature([Worker, AccessToken, RefreshToken, ResetToken, VerificationToken]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('ACCESS_TOKEN_SECRET'),
        signOptions: { expiresIn: `${configService.get<string>('ACCESS_TOKEN_EXP_TIME_IN_DAYS')}d` },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthWorkerController],
  providers: [
    AuthWorkerService,
    WorkerTokenService,
    AuthWorkerRepository,
    GoogleWorkerStrategy,
    FacebookWorkerStrategy,
  ],
  exports: [AuthWorkerService],
})
export class AuthModule {}
