import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  create(email: string, password: string) {
    const newUser = this.repo.create({ email, password });
    return this.repo.save(newUser);
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  find(email: string) {
    return this.repo.find({ where: { email } });
  }

  async update(id: number, user: Partial<User>) {
    // return this.repo.update(id, user);
    const userToUpdate = await this.findOne(id);
    if (!userToUpdate) {
      throw new NotFoundException('User not found');
    }
    Object.assign(userToUpdate, user);
    return this.repo.save(userToUpdate);
  }

  // delete(id: number) {
  //   return this.repo.delete(id);
  // }
  async remove(id: number) {
    const entity = await this.findOne(id);
    if (!entity) {
      throw new NotFoundException('User not found');
    }
    return this.repo.remove(entity);
  }
}
