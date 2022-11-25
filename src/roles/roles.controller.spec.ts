import { Test, TestingModule } from '@nestjs/testing';
import { Role } from './role.entity';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { RoleDto } from './role.dto';
import { User } from 'src/users/user.entity';
import { RequireAuth } from 'src/auth/guards/require-auth.guard';
import { CanActivate } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

const fakeUsers: User[] = [
  {
    id: 'testId',
    firstName: 'test1',
    lastName: 'test1',
    email: 'test1@email.com',
    phone: 'testPhone',
    password: 'test',
  } as User,
  {
    id: 'testId',
    firstName: 'test2',
    lastName: 'test2',
    email: 'test2@email.com',
    phone: 'testPhone',
    password: 'test',
  } as User,
  {
    id: 'testId',
    firstName: 'test3',
    lastName: 'test3',
    email: 'test3@email.com',
    phone: 'testPhone',
    password: 'test',
  } as User,
];

const testRoles: Role[] = [
  new Role('test1', 'Test Role 1'),
  new Role('test2', 'Test Role 2'),
  new Role('test3', 'Test Role 3'),
];

const testRole: Role = new Role('test', 'Test Role');

const fakeRolesService = {
  find: jest.fn().mockResolvedValue(testRoles),
  findUsers: jest
    .fn()
    .mockImplementation((role: string) => Promise.resolve(fakeUsers)),
  findById: jest
    .fn()
    .mockImplementation((id: string) => Promise.resolve(testRole)),
  findOneBy: jest
    .fn()
    .mockImplementation((filter?: Partial<Role>) => Promise.resolve(testRole)),
  create: jest
    .fn()
    .mockImplementation((role: RoleDto) => Promise.resolve(testRole)),
  update: jest
    .fn()
    .mockImplementation((id: string, attrs: RoleDto) =>
      Promise.resolve(testRole),
    ),
  delete: jest
    .fn()
    .mockImplementation((id: string) => Promise.resolve({ deleted: true })),
};

describe('RolesController', () => {
  let controller: RolesController;

  beforeEach(async () => {
    const fakeLogger = { log: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: RolesService, useValue: fakeRolesService },
        { provide: WINSTON_MODULE_NEST_PROVIDER, useValue: fakeLogger },
      ],
      controllers: [RolesController],
    }).compile();

    controller = module.get<RolesController>(RolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getRoles', () => {
    it('should fetch all roles', async () => {
      const roles = await controller.getRoles();
      expect(roles).toEqual(testRoles);
    });
  });

  describe('getUsers', () => {
    it('should fetch all users with a certain role', async () => {
      const users = await controller.getUsers('testRole');
      expect(users).toEqual(fakeUsers);
    });
  });

  describe('getRole', () => {
    it('should fetch a single role', async () => {
      const role = await controller.getRole('testId');
      expect(role).toEqual(testRole);
    });
  });

  describe('createRole', () => {
    it('should create a new role', async () => {
      const newRole = await controller.createRole(testRole);
      expect(newRole).toEqual(testRole);
    });
  });

  describe('editRole', () => {
    it('should update a role', async () => {
      const updatedRole = await controller.editRole('testId', testRole);
      expect(updatedRole).toEqual(testRole);
    });
  });

  describe('deleteRole', () => {
    it('should delete a role', async () => {
      expect(await controller.deleteRole('testId')).toEqual({ deleted: true });
    });
  });
});
