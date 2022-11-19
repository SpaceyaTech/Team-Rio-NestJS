import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleTypes } from '../roles/role.entity';
import { RolesService } from '../roles/roles.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private rolesService: RolesService,
  ) {}

  async findById(id: string) {
    const user = await this.repo.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findOneBy(filters?: Partial<User> | null) {
    const [user] = await this.repo.find({
      where: filters,
      relations: { role: true },
    });
    return user;
  }

  async findByRole(roleId: string) {
    return this.repo.find({ where: { role: { id: roleId } } });
  }

  async findByEmail(email: string) {
    const user = await this.repo.findOneBy({ email });
    return user;
  }

  find() {
    return this.repo.find();
  }

  async create(user: Partial<User>) {
    const existingUserEmail = await this.findByEmail(user.email);
    if (existingUserEmail)
      throw new BadRequestException('User with that email already exists');
    let role = await this.rolesService.findOneBy({ name: RoleTypes.USER });
    if (!role) {
      await this.rolesService.create({ name: RoleTypes.USER });
      // by default a new user will have a user role
      role = await this.rolesService.findOneBy({ name: RoleTypes.USER });
    }
    user.role = role;
    const newUser = this.repo.create(user);
    return this.repo.save(newUser);
  }

  async changeRole(id: string, role: string) {
    const user = await this.findById(id);
    const newRole = await this.rolesService.findOneBy({ name: role });
    user.role = newRole;
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
