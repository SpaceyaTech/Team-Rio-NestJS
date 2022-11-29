import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../role.entity';
import { RolesService } from '../roles.service';

const testRoles: Role[] = [
  new Role('test1', 'Test Role 1'),
  new Role('test2', 'Test Role 2'),
  new Role('test3', 'Test Role 3'),
];

const testRole: Role = new Role('test', 'Test Role');

const fakeRepository = {
  find: jest.fn().mockResolvedValue(testRoles),
  findOneBy: jest.fn().mockResolvedValue(testRole),
  findOne: jest.fn().mockResolvedValue(testRole),
  create: jest.fn().mockReturnValue(testRole),
  save: jest.fn().mockResolvedValue(testRole),
  delete: jest.fn().mockResolvedValue({ deleted: true }),
};

describe('RolesService', () => {
  let service: RolesService;
  let repository: Repository<Role>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: getRepositoryToken(Role),
          useValue: fakeRepository,
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    repository = module.get<Repository<Role>>(getRepositoryToken(Role));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have a repository', () => {
    expect(repository).toBeDefined();
  });

  describe('find', () => {
    it('should fetch a list of roles', async () => {
      const repoSpy = jest.spyOn(repository, 'find');
      const roles = await service.find();
      expect(roles).toStrictEqual(testRoles);
      expect(repoSpy).toBeCalledWith();
    });
  });

  describe('findById', () => {
    it('should fetch a single role', async () => {
      const repoSpy = jest.spyOn(repository, 'findOneBy');
      expect(service.findById('test')).resolves.toEqual(testRole);
      expect(repoSpy).toBeCalledWith({ id: 'test' });
    });

    it('should throw an error if user was not found', async () => {
      fakeRepository.findOneBy = jest.fn().mockResolvedValue(null);
      try {
        await service.findById('test');
      } catch (err) {}
    });
  });

  describe('findOneBy', () => {
    it('should return a single role based on a filter', async () => {
      const repoSpy = jest.spyOn(repository, 'findOne');
      const role = await service.findOneBy({ name: 'Test Role' });
      expect(role).toEqual(testRole);
      expect(repoSpy).toBeCalledWith({ where: { name: 'Test Role' } });
    });

    it('should return null if role was not found', async () => {
      fakeRepository.findOne = jest.fn().mockResolvedValue(null);
      const repoSpy = jest.spyOn(repository, 'findOne');
      const role = await service.findOneBy(testRole);
      expect(repoSpy).toBeCalledWith({ where: testRole });
      expect(role).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a role and return the newly created user', async () => {
      service.findOneBy = jest.fn().mockResolvedValue(null);
      const newTestRole = await service.create(testRole);
      expect(newTestRole).toEqual(testRole);
      expect(service.findOneBy).toBeCalledTimes(1);
      expect(repository.create).toBeCalledTimes(1);
      expect(repository.create).toBeCalledWith(testRole);
      expect(repository.save).toBeCalledTimes(1);
    });

    it('should throw an error if the role already exists', async () => {
      service.findOneBy = jest.fn().mockResolvedValue(testRole);
      try {
        await service.create(testRole);
        expect(service.findOneBy).toBeCalledTimes(1);
      } catch (err) {}
    });
  });

  describe('update', () => {
    it('should update a role with new name', async () => {
      fakeRepository.findOneBy = jest.fn().mockResolvedValue(testRole);
      testRole.name = 'New Name';
      const updatedRole = await service.update('test', testRole);
      expect(updatedRole).toBe(testRole);
    });

    it('should throw an error if role was not found', async () => {
      fakeRepository.findOneBy = jest.fn().mockResolvedValue(null);
      try {
        await service.update('test', testRole);
      } catch (err) {}
    });
  });

  describe('delete', () => {
    it('should delete a role if it exists', async () => {
      fakeRepository.findOneBy = jest.fn().mockResolvedValue(testRole);
      expect(service.delete('test')).resolves.toEqual({ deleted: true });
    });

    it('should throw an error if role was not found', async () => {
      fakeRepository.findOneBy = jest.fn().mockResolvedValue(null);
      try {
        await service.delete('test');
      } catch (err) {}
    });
  });
});
