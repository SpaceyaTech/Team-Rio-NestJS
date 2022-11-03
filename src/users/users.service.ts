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

  async findOneBy(filters?: Partial<User> | null) {
    const [user] = await this.repo.find({ where: filters });
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.repo.findOneBy({ email });
    return user;
  }

  async findByPhone(phone: string) {
    const user = await this.repo.findOneBy({ phone });
    return user;
  }

  find() {
    return this.repo.find();
  }

  async create(user: Partial<User>) {
    const existingUserEmail = await this.findByEmail(user.email);
    if (existingUserEmail)
      throw new BadRequestException('User with that email already exists');
    const existingUserPhone = await this.findByPhone(user.phone);
    if (existingUserPhone)
      throw new BadRequestException('User with that phone number exists');
    const newUser = this.repo.create(user);
    return this.repo.save(newUser);
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
