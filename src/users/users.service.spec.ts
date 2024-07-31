import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';
import { User } from './types/users.types';

describe('User Service e2e tests', () => {
  let app: INestApplication;
  let service: UsersService;

  const mockUsers: User[] = [
    { id: 1, name: 'John', age: 30, email: 'john@example.com' },
    { id: 2, name: 'Jane', age: 25, email: 'jane@example.com' },
    { id: 3, name: 'Jack', age: 35, email: 'jack@example.com' },
  ];

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    }).compile();

    app = moduleFixture
      .createNestApplication()
      .useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    service = await moduleFixture.get<UsersService>(UsersService);
  });

  afterEach(async () => {
    await app.close();
  });

  // region getUsers()
  test('no filters', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect(mockUsers);
  });

  test('filter by name John', () => {
    const filter = { name: 'John' };
    const result = mockUsers.filter((user) => user.name === filter.name);

    return request(app.getHttpServer())
      .get('/users')
      .query(filter)
      .expect(200)
      .expect(result);
  });

  test('filter by age', () => {
    const filter = { age: 25 };
    const result = mockUsers.filter((user) => user.age === filter.age);

    return request(app.getHttpServer())
      .get('/users')
      .query(filter)
      .expect(200)
      .expect(result);
  });

  test('filter by name and age', () => {
    const filter = { name: 'John', age: 30 };
    const result = mockUsers.filter(
      (user) => user.age === filter.age && user.name === filter.name,
    );

    return request(app.getHttpServer())
      .get('/users?name=John&age=30')
      .expect(200)
      .expect(result);
  });
  // endregion getUsers()

  // region createUser()
  test('create user', () => {
    const user = { name: 'Alex', email: 'alex@example.com', age: 29 };

    return request(app.getHttpServer())
      .post('/users')
      .send(user)
      .expect(201)
      .expect(`user ${user.email} created`);
  });

  test('create user with existing email', async () => {
    const existingUser = { name: 'John', email: 'john@example.com', age: 29 };

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(existingUser)
      .expect(409);

    expect(response.body).toHaveProperty(
      'message',
      'User with the provided email already exists.',
    );
  });

  test('create user with invalid email', async () => {
    const invalidUser = { name: 'Alex', email: 'invalid-email', age: 29 };

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(invalidUser)
      .expect(400);

    expect(response.body).toHaveProperty('message', ['email must be an email']);
  });
  // endregion createUser()
});
