import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { validate } from 'uuid';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @UseGuards(ApiGuard)
  @Post()
  @HttpCode(201)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
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
    return this.usersService.remove(id);
  }
}
