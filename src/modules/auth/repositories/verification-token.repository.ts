import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { VerificationToken } from '../models/verification-token.model';
import { Op } from 'sequelize';

@Injectable()
export class VerificationTokenRepository {
  constructor(
    @InjectModel(VerificationToken)
    private readonly verificationTokenModel: typeof VerificationToken,
  ) {}

  async create(userId: number, expiresAt: Date): Promise<VerificationToken> {
    return this.verificationTokenModel.create({ userId, expiresAt });
  }

  async findOneByTokenIdAndUserId(tokenId: string, userId: number): Promise<VerificationToken> {
    return this.verificationTokenModel.findOne({
      where: {
        id: tokenId,
        userId,
        isRevoked: false,
        expiresAt: { [Op.gt]: new Date() },
      },
    });
  }

  async revokeToken(tokenId: string): Promise<void> {
    await this.verificationTokenModel.update(
      { isRevoked: true },
      { where: { id: tokenId } }
    );
  }
}