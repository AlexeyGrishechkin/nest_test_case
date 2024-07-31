import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { QueryParams } from './types/query.types';
import { User } from './types/users.types';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getUsers(@Query() query: QueryParams): Partial<User>[] {
    return this.usersService.getUsers(query);
  }

  @Post('/create')
  createUser(@Body() { name, email, age }: CreateUserDto): Promise<string> {
    return this.usersService.createUser(name, email, age);
  }
}
