import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RefreshToken } from '../models/refresh-token.model';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectModel(RefreshToken)
    private refreshTokenModel: typeof RefreshToken,
  ) {}

  async createRefreshToken(accessTokenId: string, expiresAt: Date): Promise<RefreshToken> {
    return this.refreshTokenModel.create({ accessTokenId, expiresAt });
  }
}
