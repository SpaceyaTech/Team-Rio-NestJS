import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { BlogPost } from './blog.entity';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(BlogPost) private repo: Repository<BlogPost>,
    private usersService: UsersService,
  ) {}

  async findById(id: string) {
    const blog = await this.repo.findOneBy({ id });
    if (!blog) throw new NotFoundException('Blog not found');
    return blog;
  }

  find() {
    return this.repo.find();
  }

  async create(blog: Partial<BlogPost>, user: Partial<User>) {
    const author = await this.usersService.findById(user.id);
    blog.author = author;
    const newBlog = this.repo.create(blog);
    return this.repo.save(newBlog);
  }

  async update(id: string, attrs: Partial<BlogPost>) {
    const blog = await this.findById(id);
    Object.assign(blog, attrs);
    return this.repo.save(blog);
  }

  delete(id: string) {
    return this.repo.delete({ id });
  }
}
