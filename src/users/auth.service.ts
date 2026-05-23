import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { UsersService } from './users.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signup(email: string, password: string) {
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('Email already exists');
    }
    // encrypt the user password
    // generate salt, hash salt + password
    const salt = randomBytes(8).toString('hex');
    const hash: Buffer = (await scrypt(password, salt, 64)) as Buffer;
    const passwordHash = `${salt}.${hash.toString('hex')}`;
    // join the hashed result and the salt to form the final password

    // store the new record in the database
    return this.usersService.create(email, passwordHash);
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const [salt, hashedPassword] = user.password.split('.');
    const hash: Buffer = (await scrypt(password, salt, 64)) as Buffer;
    if (hash.toString('hex') !== hashedPassword) {
      throw new BadRequestException('Incorrect password');
    }
    return user;
  }
}
