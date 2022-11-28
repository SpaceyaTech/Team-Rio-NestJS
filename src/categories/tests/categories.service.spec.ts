import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BlogPost } from '../../blogs/blog.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from '../categories.service';
import { Category } from '../category.entity';

const fakeBlogs = [new BlogPost()];

const fakeCategory: Category = new Category('Test Category', fakeBlogs);

const fakeCategories = [fakeCategory];

const fakeRepository = {
  find: jest.fn().mockResolvedValue(fakeCategories),
  findOneBy: jest.fn().mockResolvedValue(fakeCategory),
  findOne: jest.fn().mockResolvedValue(fakeCategory),
  create: jest.fn().mockReturnValue(fakeCategory),
  save: jest.fn().mockResolvedValue(fakeCategory),
  delete: jest.fn().mockResolvedValue({ deleted: true }),
};

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repository: Repository<Category>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: getRepositoryToken(Category), useValue: fakeRepository },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    repository = module.get<Repository<Category>>(getRepositoryToken(Category));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have a repository defined', () => {
    expect(repository).toBeDefined();
  });

  describe('find', () => {
    it('should fetch all categories', async () => {
      const repoSpy = jest.spyOn(repository, 'find');
      const categories = await service.find();
      expect(categories).toEqual(fakeCategories);
      expect(repoSpy).toBeCalledWith();
    });
  });

  describe('findOne', () => {
    it('should fetch a single category', async () => {
      const repoSpy = jest.spyOn(repository, 'findOneBy');
      const category = await service.findOne(fakeCategory.name);
      expect(category).toEqual(fakeCategory);
      expect(repoSpy).toBeCalledWith({ name: fakeCategory.name });
    });

    it('should throw an error if category was not found', async () => {
      fakeRepository.findOneBy = jest.fn().mockResolvedValue(null);
      try {
        await service.findOne(fakeCategory.name);
      } catch (err) {}
    });
  });

  describe('findBlogsByCategory', () => {
    it('should fetch all blogs in a certain category', async () => {
      fakeRepository.findOneBy = jest.fn().mockResolvedValue(fakeCategory);
      const repoSpy = jest.spyOn(repository, 'findOne');
      const blogs = await service.findBlogsByCategory(fakeCategory.name);
      expect(blogs).toEqual(fakeBlogs);
      expect(repoSpy).toBeCalledWith({
        where: { name: fakeCategory.name },
        relations: { blogPosts: true },
      });
    });
  });

  describe('create', () => {
    it('should persist a category', async () => {
      fakeRepository.findOneBy = jest.fn().mockResolvedValue(null);
      const repoCreateSpy = jest.spyOn(repository, 'create');
      const repoSaveSpy = jest.spyOn(repository, 'save');
      const category = await service.create(fakeCategory);
      expect(category).toEqual(fakeCategory);
      expect(repoCreateSpy).toBeCalledWith(fakeCategory);
      expect(repoSaveSpy).toBeCalledWith(fakeCategory);
    });

    it('should throw an error if a category already exixts', async () => {
      fakeRepository.findOneBy = jest.fn().mockResolvedValue(fakeCategory);
      try {
        await service.create(fakeCategory);
      } catch (err) {}
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      fakeRepository.findOneBy = jest.fn().mockResolvedValue(fakeCategory);
      const category = await service.update(fakeCategory.name, fakeCategory);
      expect(category).toEqual(fakeCategory);
    });

    it('should throw an error if category does not exist', async () => {
      fakeRepository.findOneBy = jest.fn().mockResolvedValue(null);
      try {
        await service.update(fakeCategory.name, fakeCategory);
      } catch (err) {}
    });
  });

  describe('delete', () => {
    it('should delete a category', async () => {
      fakeRepository.findOneBy = jest.fn().mockResolvedValue(fakeCategory);
      const repoSpy = jest.spyOn(repository, 'delete');
      expect(await service.delete(fakeCategory.name)).toEqual({
        deleted: true,
      });
      expect(repoSpy).toBeCalledWith({ name: fakeCategory.name });
    });

    it('should throw an error it the category is not found', async () => {
      fakeRepository.findOneBy = jest.fn().mockResolvedValue(null);
      try {
        await service.delete(fakeCategory.name);
      } catch (err) {}
    });
  });
});
