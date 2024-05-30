import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { AccessTokenRepository } from './repositories/access-token.repository';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.model';
import { AuthResponse } from 'common/interfaces/auth-response.interface';

@Injectable()
export class AuthService {
  private readonly ACCESS_TOKEN_EXP_TIME_IN_DAYS = 1;
  private readonly REFRESH_TOKEN_EXP_TIME_IN_DAYS = 7;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly accessTokenRepository: AccessTokenRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findUserByEmail(email);
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        return user;
      }
    }
    return null;
  }

  async generateTokens(user: User): Promise<AuthResponse> {
    const accessTokenExpiresAt: Date = new Date();
    accessTokenExpiresAt.setDate(accessTokenExpiresAt.getDate() + this.ACCESS_TOKEN_EXP_TIME_IN_DAYS);

    const refreshTokenExpiresAt: Date = new Date();
    refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + this.REFRESH_TOKEN_EXP_TIME_IN_DAYS);

    const accessTokenRecord = await this.accessTokenRepository.createAccessToken(user.id, accessTokenExpiresAt);
    const refreshTokenRecord = await this.refreshTokenRepository.createRefreshToken(accessTokenRecord.id, refreshTokenExpiresAt);

    const accessTokenEncode = {
      jti: accessTokenRecord.id,
      sub: user.id,
    };

    const refreshTokenEncode = {
      jti: refreshTokenRecord.id,
      sub: accessTokenRecord.id,
    };

    const accessTokenString = this.jwtService.sign(accessTokenEncode, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET')!,
      expiresIn: `${this.ACCESS_TOKEN_EXP_TIME_IN_DAYS}d`,
    });

    const refreshTokenString = this.jwtService.sign(refreshTokenEncode, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET')!,
      expiresIn: `${this.REFRESH_TOKEN_EXP_TIME_IN_DAYS}d`,
    });

    return {
      accessToken: accessTokenString,
      refreshToken: refreshTokenString,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
      user,
    };
  }

  async login(user: User): Promise<{ authResponse: AuthResponse }> {
    const authResponse = await this.generateTokens(user);
    return { authResponse };
  }
}
