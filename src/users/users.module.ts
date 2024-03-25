import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ApiGuard } from 'src/api.guard';

@Module({
  imports: [ApiGuard],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
