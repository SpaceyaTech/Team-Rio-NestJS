import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, RolesEnum } from '../roles/role.entity';
import { RolesService } from '../roles/roles.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { ConfigService } from '@nestjs/config';
import { AdminConfig } from '../../config';
const bcrypt = require('bcrypt');

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private rolesService: RolesService,
    private readonly configService: ConfigService,
  ) {}

  async findById(id: string) {
    const user = await this.repo.findOne({
      where: { id },
      relations: { roles: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findOneBy(filters?: Partial<User> | null) {
    const [user] = await this.repo.find({
      where: filters,
      relations: { roles: true },
    });
    return user;
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
    if (!user.roles?.length) {
      const userRole = await this.rolesService.findOneBy({
        name: RolesEnum.USER,
      });
      user.roles = [userRole];
    }
    user.password = bcrypt.hashSync(user.password, 10); // hash a user's password
    const newUser = this.repo.create(user);
    return this.repo.save(newUser);
  }

  async addRole(userId: string, roleName: string) {
    const user = await this.findById(userId);
    const role = await this.rolesService.findOneBy({ name: roleName });
    const existingRole = user.roles.find(
      (userRole) => userRole.name === role.name,
    );
    if (existingRole)
      throw new BadRequestException(
        `User already has ${role.name} privilleges`,
      );
    user.roles.push(role);
    return this.repo.save(user);
  }

  async removeRole(userId: string, roleName: string) {
    const user = await this.findById(userId);
    const role = await this.rolesService.findOneBy({ name: roleName });
    const existingRole = user.roles.find(
      (userRole) => userRole.name === role.name,
    );
    if (!existingRole)
      throw new BadRequestException(
        `User does not have ${role.name} privilleges`,
      );
    user.roles = user.roles.filter((userRole) => userRole.name !== role.name);
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

  // called once the host modules have been initialized
  async onModuleInit(): Promise<void> {
    const adminCredentials = this.configService.get<AdminConfig>('auth.admin');
    const existingUser = await this.findByEmail(adminCredentials.email);

    if (!existingUser) {
      let adminRole: Role;

      try {
        adminRole = await this.rolesService.create({ name: RolesEnum.ADMIN });
      } catch (err) {
        adminRole = await this.rolesService.findOneBy({
          name: RolesEnum.ADMIN,
        });
      }

      let adminUser: User = { ...adminCredentials, roles: [adminRole] };
      await this.create(adminUser);
      console.log(`Created ${RolesEnum.ADMIN} user`);
    }
  }
}
