import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { textToTitle } from '../utils';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private repo: Repository<Category>) {}

  async find() {
    return this.repo.find();
  }

  async findOne(name: string) {
    const category = await this.repo.findOneBy({ name });
    if (!category) throw new NotFoundException('Category not fount');
    return category;
  }

  async findBlogsByCategory(categoryName: string) {
    await this.findOne(categoryName);
    const { blogPosts } = await this.repo.findOne({
      where: { name: categoryName },
      relations: { blogPosts: true },
    });
    return blogPosts;
  }

  async create(category: Partial<Category>) {
    category.name = textToTitle(category.name);
    const existingCategory = await this.repo.findOneBy({ name: category.name });
    if (existingCategory)
      throw new BadRequestException('Category already exists');
    const newCategory = this.repo.create(category);
    return this.repo.save(newCategory);
  }

  async update(name: string, attrs: Partial<Category>) {
    const category = await this.findOne(name);
    Object.assign(category, attrs);
    return this.repo.save(category);
  }

  async delete(name: string) {
    const category = await this.findOne(name);
    await this.repo.delete({ name });
    return { deleted: true };
  }
}
