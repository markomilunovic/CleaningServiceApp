import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

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
    return this.userRepository.findUserByEmail(email);
  }
}
