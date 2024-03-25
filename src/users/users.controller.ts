import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { validate } from 'uuid';
import { User } from './entities/user.entity';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @UseGuards(ApiGuard)
  @Post()
  @HttpCode(201)
  create(@Body() createUserDto: CreateUserDto) {
    try {
      const createdUser = this.usersService.create(createUserDto);
      return createdUser;
    } catch (error) {
      throw new HttpException(
        'Failed to create user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  findOne(@Param('id') id: string) {
    if (!validate(id)) {
      throw new HttpException('id is invalid', 400);
    }
    const foundUser = this.usersService.findOne(id);
    if (!foundUser) {
      throw new HttpException('user not found', 404);
    }
    return foundUser;
  }

  // @UseGuards(ApiGuard)
  @Put(':id')
  @HttpCode(200)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    if (!validate(id)) {
      throw new BadRequestException('Invalid userId');
    }
    if (!updateUserDto.newPassword || !updateUserDto.oldPassword) {
      throw new BadRequestException('Invalid update data');
    }

    const updatedUser = this.usersService.update(id, updateUserDto);
    return updatedUser;
  }

  // @UseGuards(ApiGuard)
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    if (!validate(id)) {
      throw new BadRequestException('Invalid userId');
    }
    const user = this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User does not exist!');
    }
    return this.usersService.remove(id);
  }
}
