import {
  Injectable, ConflictException, InternalServerErrorException, NotFoundException,
  Inject
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.model';
import * as bcrypt from 'bcrypt';
import { EditUserDto } from './dtos/edit-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import { EmailVerificationService } from './email-verification.service';

@Injectable()
export class UserService {
  private readonly RESET_TOKEN_EXP_TIME_IN_HOURS = 1;

  constructor(
    private readonly userRepository: UserRepository,
    @Inject('RESET_JWT_SERVICE')
    private readonly resetJwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  async registerUser(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findUserByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists.');
    }

    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = await this.userRepository.createUser({ ...createUserDto, password: hashedPassword });
      const verificationToken = await this.emailVerificationService.generateVerificationToken(user);
      await this.emailVerificationService.sendVerificationEmail(user, verificationToken);
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error registering user.');
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findUserByEmail(email);
      if (!user) {
        throw new NotFoundException('User not found.');
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error finding user.');
    }
  }

  async findUserById(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findUserById(id);
      if (!user) {
        throw new NotFoundException('User not found.');
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error finding user.');
    }
  }

  async updateUser(id: number, editUserDto: EditUserDto): Promise<User> {
    try {
      const user = await this.userRepository.updateUser(id, editUserDto);
      if (!user) {
        throw new NotFoundException('User not found.');
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error updating user.');
    }
  }

  async generateResetToken(email: string): Promise<void> {
    try {
      const user = await this.findUserByEmail(email);
      const expiresAt: Date = new Date();
      expiresAt.setHours(expiresAt.getHours() + this.RESET_TOKEN_EXP_TIME_IN_HOURS);

      const resetTokenRecord = await this.userRepository.createResetToken(user.id, expiresAt);

      const resetTokenEncode = {
        jti: resetTokenRecord.id,
        sub: user.id,
      };

      const resetTokenString = this.resetJwtService.sign(resetTokenEncode, {
        secret: this.configService.get<string>('RESET_TOKEN_SECRET')!,
        expiresIn: `${this.RESET_TOKEN_EXP_TIME_IN_HOURS}h`,
      });

      await this.emailService.sendResetPasswordEmail(user.email, resetTokenString);
    } catch (error) {
      throw new InternalServerErrorException('Error generating reset token.');
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const decodedToken = this.resetJwtService.verify(token, {
        secret: this.configService.get<string>('RESET_TOKEN_SECRET')
      });
      const userId = decodedToken.sub;

      const resetToken = await this.userRepository.findResetToken(userId);
      if (!resetToken || resetToken.isRevoked || resetToken.expiresAt < new Date()) {
        throw new ConflictException('Invalid or expired reset token.');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.userRepository.updateUserPassword(userId, hashedPassword);
      await this.userRepository.revokeResetToken(resetToken.id);
    } catch (error) {
      throw new InternalServerErrorException('Error resetting password.');
    }
  }

  async getAllWorkers() {
    const workers = await this.userRepository.getAllWorkers();
    return workers;
  };

}