import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogsService } from '../blogs/blogs.service';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dtos/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private repo: Repository<Comment>,
    private blogsService: BlogsService,
  ) {}

  find() {
    return this.repo.find();
  }

  async findById(id: string) {
    const comment = await this.repo.findOneBy({ id });
    if (!comment) throw new NotFoundException('Comment not found');
    return comment;
  }

  async countByBlog(blogId: string) {
    const blog = await this.blogsService.findById(blogId);
    const count = await this.repo.count({ where: { blog: blog } });
    return { count };
  }

  async create(comment: CreateCommentDto, user: Partial<User>) {
    // user commes from the session object
    const { content, blogId } = comment;
    const blog = await this.blogsService.findById(blogId);
    if (!blog) throw new NotFoundException('Blog not found');
    const newComment = this.repo.create({ content, blog, user });
    return this.repo.save(newComment);
  }

  async update(id: string, attrs: Partial<Comment>) {
    const comment = await this.findById(id);
    Object.assign(comment, attrs);
    comment.edited = true; // add the edited flag to the comment
    return this.repo.save(comment);
  }

  async delete(id: string) {
    const comment = await this.findById(id);
    await this.repo.delete({ id });
    return { deleted: true };
  }
}
