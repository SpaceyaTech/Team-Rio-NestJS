import { Test, TestingModule } from '@nestjs/testing';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { RolesService } from '../roles/roles.service';
import { create } from 'domain';
import { Role } from '../roles/role.entity';

it('Can create an instance of users service', async () => {
  let service: UsersService;

  const fakeRolesService: Partial<RolesService> = {
    create: (role: Partial<Role>) => Promise.resolve(role as Role),
    findOneBy: (filter: Partial<Role>) =>
      Promise.resolve({ id: 'test', ...filter } as Role),
  };

  const module: TestingModule = await Test.createTestingModule({
    providers: [
      UsersService,
      { provide: RolesService, useValue: fakeRolesService },
    ],
  }).compile();

  service = module.get<UsersService>(UsersService);

  expect(service).toBeDefined();
});
