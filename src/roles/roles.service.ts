import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, RolesEnum } from './role.entity';

@Injectable()
export class RolesService implements OnModuleInit {
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
    const role = await this.repo.findOne({ where: filter });
    return role;
  }

  async findUsers(role: string) {
    return this.repo.find({
      where: { name: role },
      relations: { users: true },
    });
  }

  async create(role: Partial<Role>) {
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

  async delete(id: string) {
    const role = await this.findById(id);
    await this.repo.delete({ id });
    return { deleted: true };
  }

  async onModuleInit() {
    Object.values(RolesEnum).forEach(async (roleName) => {
      const existingRole = await this.findOneBy({ name: roleName });
      if (!existingRole) {
        const newRole = await this.create({ name: roleName });
        console.log(`Created ${newRole.name} role.`);
      }
    });
  }
}
