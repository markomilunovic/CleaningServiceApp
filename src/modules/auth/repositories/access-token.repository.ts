import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AccessToken } from '../models/access-token.model';

@Injectable()
export class AccessTokenRepository {
  constructor(
    @InjectModel(AccessToken)
    private accessTokenModel: typeof AccessToken,
  ) {}

  async createAccessToken(userId: number, expiresAt: Date): Promise<AccessToken> {
    return this.accessTokenModel.create({ userId, expiresAt });
  }
}
