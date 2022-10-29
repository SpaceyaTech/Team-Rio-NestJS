import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findById(id: string) {
    const user = await this.repo.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.repo.findOneBy({ email });
    return user;
  }

  find() {
    return this.repo.find();
  }

  create(user: Partial<User>) {
    const existingUser = this.findByEmail(user.email);
    if (existingUser)
      throw new BadRequestException('User with that email already exists');
    const newUser = this.repo.create(user);
    return this.repo.save(user);
  }

  async update(id: string, attr: Partial<User>) {
    const user = await this.findById(id);
    Object.assign(user, attr);
    return this.repo.save(user);
  }

  delete(id: string) {
    return this.repo.delete({ id });
  }
}
