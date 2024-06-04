import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { CreateUserDto } from './dtos/create-user.dto';
import { EditUserDto } from './dtos/edit-user.dto';
import { ResetToken } from 'modules/auth/models/reset-token.model';
import { Worker } from 'modules/worker/models/worker.model';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(ResetToken)
    private resetTokenModel: typeof ResetToken,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.userModel.create(createUserDto);
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ where: { email } });
  }

  async findUserById(id: number): Promise<User> {
    return this.userModel.findByPk(id);
  }

  async updateUser(id: number, editUserDto: EditUserDto): Promise<User> {
    const user = await this.findUserById(id);
    if (user) {
      return user.update(editUserDto);
    }
    return null;
  }

  async createResetToken(userId: number, expiresAt: Date): Promise<ResetToken> {
    return this.resetTokenModel.create({ userId, expiresAt });
  }

  async findResetToken(userId: number): Promise<ResetToken> {
    return this.resetTokenModel.findOne({ where: { userId } });
  }

  async revokeResetToken(token: string): Promise<void> {
    await this.resetTokenModel.update({ isRevoked: true }, { where: { id: token } });
  }

  async updateUserPassword(userId: number, hashedPassword: string): Promise<void> {
    await this.userModel.update({ password: hashedPassword }, { where: { id: userId } });
  }

  async getAllWorkers(): Promise<Worker[]> {
    const workers = await Worker.findAll();
    return workers;
  };
}