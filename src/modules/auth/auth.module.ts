import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { SequelizeModule } from "@nestjs/sequelize";
import { UserModule } from "modules/user/user.module";
import { AccessToken } from "./models/access-token.model";
import { RefreshToken } from "./models/refresh-token.model";
import { AuthUserService } from "./services/auth-user.service";
import { AuthWorkerService } from "./services/auth-worker.service";
import { JwtUserStrategy } from "./strategies/user/jwt-user.strategy";
import { GoogleUserStrategy } from "./strategies/user/google-user.strategy";
import { GoogleWorkerStrategy } from "./strategies/worker/google-worker.strategy";
import { FacebookUserStrategy } from "./strategies/user/facebook-user.strategy";
import { FacebookWorkerStrategy } from "./strategies/worker/facebook-worker.strategy";
import { AccessTokenRepository } from "./repositories/access-token.repository";
import { RefreshTokenRepository } from "./repositories/refresh-token.repository";
import { AuthWorkerRepository } from "./repositories/auth-worker.repository";
import { TokenService } from "./services/token-service";
import { AuthUserController } from "./controllers/auth-user.controller";
import { AuthWorkerController } from "./controllers/auth-worker.controller";
import { EmailService } from "./services/email.service";

@Module({
  imports: [
    UserModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('ACCESS_TOKEN_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    SequelizeModule.forFeature([AccessToken, RefreshToken]),
  ],
  controllers: [AuthUserController, AuthWorkerController],
  providers: [
    AuthUserService,
    AuthWorkerService,
    JwtUserStrategy,
    GoogleUserStrategy,
    GoogleWorkerStrategy,
    FacebookUserStrategy,
    FacebookWorkerStrategy,
    AccessTokenRepository,
    RefreshTokenRepository,
    AuthWorkerRepository,
    TokenService,
    EmailService
  ],

})
export class AuthModule {}
