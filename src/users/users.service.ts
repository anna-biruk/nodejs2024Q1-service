import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

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
    const user = this.userRepository.create(createUserDto);

    this.userRepository.save(user);
    return {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.newPassword && updateUserDto.oldPassword) {
      if (!this.validateOldPassword(updateUserDto.oldPassword, user.password)) {
        throw new ForbiddenException('Old password is incorrect');
      }
      user.password = updateUserDto.newPassword;
    } else {
      throw new BadRequestException(
        'Both oldPassword and newPassword are required for password update',
      );
    }

    return this.userRepository.save(user);
  }

  remove(id: string) {
    this.userRepository.delete(id);
  }
}
