import { Injectable } from '@nestjs/common';
import { User } from './types/users.types';
import { QueryParams } from './types/query.types';

@Injectable()
export class UsersService {
  private readonly usersRepository: User[] = [
    { id: 1, name: 'John', email: 'john@example.com', age: 30 },
    { id: 2, name: 'Jane', email: 'jane@example.com', age: 25 },
    { id: 3, name: 'Jack', email: 'jack@example.com', age: 35 },
  ];

  getUsers(query: QueryParams): Partial<User>[] {
    let filteredUsers = this.usersRepository;

    if (query.name) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.includes(query.name),
      );
    }

    if (query.age) {
      filteredUsers = filteredUsers.filter(
        (user) => user.age === Number(query.age),
      );
    }

    if (query.email) {
      filteredUsers = filteredUsers.filter(
        (user) => user.email === query.email,
      );
    }

    return filteredUsers;
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
