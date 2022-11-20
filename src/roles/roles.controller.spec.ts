import { Test, TestingModule } from '@nestjs/testing';
import { Role } from './role.entity';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { RoleDto } from './role.dto';

const testRoles: Role[] = [
  new Role('test1', 'Test Role 1'),
  new Role('test2', 'Test Role 2'),
  new Role('test3', 'Test Role 3'),
];

const testRole: Role = new Role('test', 'Test Role');

const fakeRolesService = {
  find: jest.fn().mockResolvedValue(testRoles),
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
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: RolesService, useValue: fakeRolesService }],
      controllers: [RolesController],
    }).compile();

    controller = module.get<RolesController>(RolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getRoles', () => {
    it('should get an array of roles', async () => {
      const roles = await controller.getRoles();
      expect(roles).toEqual(testRoles);
    });
  });
});
