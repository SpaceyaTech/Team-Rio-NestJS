import { Test, TestingModule } from '@nestjs/testing';
import { BlogPost } from '../../blogs/blog.entity';
import { CategoriesController } from '../categories.controller';
import { CategoriesService } from '../categories.service';
import { Category } from '../category.entity';

const fakeBlogs = [new BlogPost()];

const fakeCategory: Category = new Category('Test Category', fakeBlogs);

const fakeCategories = [fakeCategory];

const fakeService = {
  find: jest.fn().mockResolvedValue(fakeCategories),
  findOne: jest.fn((name: string) => Promise.resolve(fakeCategory)),
  findBlogsByCategory: jest.fn((categoryName: string) =>
    Promise.resolve(fakeBlogs),
  ),
  create: jest.fn((category: Partial<Category>) =>
    Promise.resolve(fakeCategory),
  ),
  update: jest.fn((name: string, attrs: Partial<Category>) =>
    Promise.resolve(fakeCategory),
  ),
  delete: jest.fn((name: string) => Promise.resolve({ deleted: true })),
};

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: CategoriesService, useValue: fakeService }],
      controllers: [CategoriesController],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have a service', () => {
    expect(service).toBeDefined();
  });

  describe('getCategories', () => {
    it('should fetch all categories', async () => {
      const serviceSpy = jest.spyOn(service, 'find');
      const categories = await controller.getCategories();
      expect(categories).toEqual(fakeCategories);
      expect(serviceSpy).toBeCalledTimes(1);
      expect(serviceSpy).toBeCalledWith();
    });
  });

  describe('getCategory', () => {
    it('should fetch a single category', async () => {
      const serviceSpy = jest.spyOn(service, 'findOne');
      const category = await controller.getCategory(fakeCategory.name);
      expect(category).toEqual(fakeCategory);
      expect(serviceSpy).toBeCalledTimes(1);
      expect(serviceSpy).toBeCalledWith(fakeCategory.name);
    });
  });

  describe('getBlogsByCategory', () => {
    it('should fetch all blogs in a particular category', async () => {
      const serviceSpy = jest.spyOn(service, 'findBlogsByCategory');
      const blogs = await controller.getBlogsByCategory(fakeCategory.name);
      expect(blogs).toEqual(fakeBlogs);
      expect(serviceSpy).toBeCalledTimes(1);
      expect(serviceSpy).toBeCalledWith(fakeCategory.name);
    });
  });

  describe('createCategory', () => {
    it('should create a category', async () => {
      const serviceSpy = jest.spyOn(service, 'create');
      const category = await controller.createCategoy(fakeCategory);
      expect(category).toEqual(fakeCategory);
      expect(serviceSpy).toBeCalledTimes(1);
      expect(serviceSpy).toBeCalledWith(fakeCategory);
    });
  });

  describe('editCategory', () => {
    it('should edit a category', async () => {
      const serviceSpy = jest.spyOn(service, 'update');
      const category = await controller.editCategory(
        fakeCategory.name,
        fakeCategory,
      );
      expect(category).toEqual(fakeCategory);
      expect(serviceSpy).toBeCalledTimes(1);
      expect(serviceSpy).toBeCalledWith(fakeCategory.name, fakeCategory);
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category', async () => {
      const serviceSpy = jest.spyOn(service, 'delete');
      expect(await controller.deleteCategory(fakeCategory.name)).toEqual({
        deleted: true,
      });
      expect(serviceSpy).toBeCalledTimes(1);
      expect(serviceSpy).toBeCalledWith(fakeCategory.name);
    });
  });
});
