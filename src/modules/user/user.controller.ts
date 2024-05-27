import { Controller, Post, Body, BadRequestException, ConflictException, InternalServerErrorException, Put, Param, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { EditUserDto } from './dto/edit-user.dto';
import { JwtAuthGuard } from 'common/guards/jwt-auth.guard';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.userService.registerUser(createUserDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  @Put('edit/:id')
  @UseGuards(JwtAuthGuard)
  async editUser(@Param('id') id: number, @Body() editUserDto: EditUserDto) {
    const updatedUser = await this.userService.updateUser(id, editUserDto);
    if (!updatedUser) {
      throw new BadRequestException('User not found');
    }
    return updatedUser;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUser(@Param('id') id: number) {
    const user = await this.userService.findUserById(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }
}
