import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { EditUserDto } from './dto/edit-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
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
}
