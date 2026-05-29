import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'test@example.com',
          password: '123456',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([
          {
            id: 1,
            email,
            password: '123456',
          } as User,
        ]);
      },
      remove: () => {
        return Promise.resolve({} as User);
      },
      update: (_id: number, user: Partial<User>) => {
        return Promise.resolve(user as User);
      },
    };
    fakeAuthService = {
      signup: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('findAllusers returns a list of users with given email', async () => {
    const users = await controller.findAllUsers('test@example.com');
    expect(users).toBeDefined();
    expect(users.length).toBe(1);
    expect(users[0].email).toBe('test@example.com');
  });

  it('findUser throws an error if user with given id is not found', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });
  it('findUser returns null if user with given id is not found', async () => {
    fakeUsersService.findOne = (_id: number) => Promise.resolve(null);
    await expect(controller.findUser('2')).rejects.toThrow(NotFoundException);
  });

  it('updateUser throws an error if user with given id is not found', async () => {
    const user = await controller.updateUser('2', {
      email: 'test@example.com',
    });
    expect(user).toBeDefined();
  });
  it('signin updates session object and returns user', async () => {
    const session = {
      userId: 0,
    };
    const user = await controller.signin(
      {
        email: 'asdf@example.com',
        password: '123456',
      },
      session,
    );
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
