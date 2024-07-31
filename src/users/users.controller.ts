import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { QueryParams } from './types/query.types';
import { User } from './types/users.types';
import { createFilter } from './utils/create-filter';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getUsers(@Query() query: QueryParams): Partial<User>[] {
    const filter = createFilter(query);

    return this.usersService.getUsers(filter);
  }

  @Post('/create')
  createUser(@Body() { name, email, age }: CreateUserDto): Promise<string> {
    return this.usersService.createUser(name, email, age);
  }
}
