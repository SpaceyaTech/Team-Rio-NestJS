import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RolesService {
  constructor(@InjectRepository(Role) private repo: Repository<Role>) {}

  find() {
    return this.repo.find();
  }

  async findById(id: string) {
    const role = await this.repo.findOneBy({ id });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async findOneBy(filter?: Partial<Role> | null) {
    const [role] = await this.repo.find({ where: filter });
    return role;
  }

  async create(role: Partial<Role>) {
    role.name = role.name.toLowerCase();
    const existingRole = await this.findOneBy({ name: role.name });
    if (existingRole) throw new BadRequestException('Role already exists');
    const newRole = this.repo.create(role);
    return this.repo.save(newRole);
  }

  async update(id: string, attrs: Partial<Role>) {
    attrs.name = attrs.name.toLowerCase();
    const role = await this.findById(id);
    Object.assign(role, attrs);
    return this.repo.save(role);
  }

  delete(id: string) {
    return this.repo.delete({ id });
  }
}
