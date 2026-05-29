import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

const scrypt = promisify(_scrypt);

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  beforeEach(async () => {
    // create a fake copy of users service
    fakeUsersService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('test@example.com', '123456');
    expect(user).toBeDefined();
    expect(user.password).not.toEqual('123456');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws signin is called with an unused email', async () => {
    await expect(service.signin('asdf@asdf.com', 'asdf')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws if an invalid password is provided', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        { id: 1, email: 'a@example.com', password: '2' } as User,
      ]);

    await expect(service.signin('a@example.com', '1')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('does not throw an error if valid password is provided', async () => {
    const dbsalt = randomBytes(8).toString('hex');
    const dbhash: Buffer = (await scrypt('1', dbsalt, 64)) as Buffer;
    const dbpassword = `${dbsalt}.${dbhash.toString('hex')}`;
    fakeUsersService.find = () =>
      Promise.resolve([
        { id: 1, email: 'a@example.com', password: dbpassword } as User,
      ]);
    const user = await service.signin('a@example.com', '1');
    expect(user).toBeDefined();
    expect(user.email).toEqual('a@example.com');
    expect(user.password).not.toEqual('1');
    const [salt, hashedPassword] = user.password.split('.');
    const hash: Buffer = (await scrypt('1', salt, 64)) as Buffer;
    expect(hashedPassword).toEqual(hash.toString('hex'));
  });
});
