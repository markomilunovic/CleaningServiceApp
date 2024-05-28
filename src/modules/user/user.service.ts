import {
  Injectable, ConflictException, InternalServerErrorException, NotFoundException
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.model';
import * as bcrypt from 'bcrypt';
import { EditUserDto } from './dto/edit-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';

@Injectable()
export class UserService {
  private readonly RESET_TOKEN_EXP_TIME_IN_HOURS = 1;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async registerUser(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findUserByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists.');
    }

    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      return this.userRepository.createUser({ ...createUserDto, password: hashedPassword });
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

      const resetTokenString = this.jwtService.sign(resetTokenEncode, {
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
      const decodedToken = this.jwtService.verify(token);
      const userId = decodedToken.sub;

      const resetToken = await this.userRepository.findResetToken(userId);
      if (!resetToken || resetToken.isRevoked || resetToken.expiresAt < new Date()) {
        throw new ConflictException('Invalid or expired reset token.');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.userRepository.updateUserPassword(userId, hashedPassword);
      await this.userRepository.revokeResetToken(token);
    } catch (error) {
      throw new InternalServerErrorException('Error resetting password.');
    }
  }
}
