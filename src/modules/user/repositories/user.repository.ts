import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { CreateUserDto } from '../dtos/create-user.dto';
import { EditUserDto } from '../dtos/edit-user.dto';
import { ResetToken } from 'modules/auth/models/reset-token.model';
import { Worker } from 'modules/worker/models/worker.model';
import { Job } from 'modules/job/job.model';
import { ApproveJobType, ApproveWorkerType } from '../utils/types';

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

  async approveWorker(approveWorkerType: ApproveWorkerType) {
    const { id } = approveWorkerType;
    await Worker.update({ verifiedByAdmin: true }, { where: { id: id }});
  };

  async getAllJobs(): Promise<Job[]> {
    const jobs = await Job.findAll();
    return jobs;
  };

  async approveJob(approveJobType: ApproveJobType): Promise<void> {
    const { id } = approveJobType;
    await Job.update({ approvedByAdmin: true }, { where: { id: id }});
  };
};