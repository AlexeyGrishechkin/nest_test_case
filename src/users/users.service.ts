import { Injectable } from '@nestjs/common';
import { User } from './types/users.types';
import { FilterTypes } from './types/filter.types';

@Injectable()
export class UsersService {
  private readonly usersRepository: User[] = [
    { id: 1, name: 'John', email: 'john@example.com', age: 30 },
    { id: 2, name: 'Jane', email: 'jane@example.com', age: 25 },
    { id: 3, name: 'Jack', email: 'jack@example.com', age: 35 },
  ];

  getUsers(filter: FilterTypes): Partial<User>[] {
    return this.usersRepository.filter((user) => {
      for (const key in filter) {
        if (user[key] !== filter[key]) return false;
      }

      return true;
    });
  }

  async createUser(name: string, email: string, age: number): Promise<string> {
    const userIsAlreadyExist = this.usersRepository.find(
      (user) => user.email === email,
    );

    if (userIsAlreadyExist) {
      throw new Error('User already exists');
    }

    const user = { id: Date.now(), name, email, age };

    this.usersRepository.push(user);

    return `user ${user.email} created`;
  }
}
