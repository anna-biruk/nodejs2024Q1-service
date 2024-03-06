import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [];

  private validateOldPassword(
    oldPassword: string,
    currentPassword: string,
  ): boolean {
    return oldPassword === currentPassword;
  }

  create(createUserDto: CreateUserDto) {
    if (!createUserDto.login || !createUserDto.password) {
      throw new BadRequestException('Login and password are required');
    }
    const user = new User(createUserDto.login, createUserDto.password);
    this.users.push(user);
    return {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  findAll() {
    return this.users;
  }

  findOne(id: string) {
    return this.users.find((user) => user.id === id);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.newPassword) {
      user.password = updateUserDto.newPassword;
    }

    if (updateUserDto.password) {
      if (!this.validateOldPassword(updateUserDto.oldPassword, user.password)) {
        throw new ForbiddenException('Old password is incorrect');
      }
      user.password = updateUserDto.password;
    }

    const timestamp = new Date().getMilliseconds();
    return {
      id: user.id,
      login: user.login,
      version: user.version + 1,
      createdAt: user.createdAt,
      updatedAt: timestamp,
    };
  }

  remove(id: string) {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    this.users.splice(userIndex, 1);
  }
}
