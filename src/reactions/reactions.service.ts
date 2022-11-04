import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogsService } from 'src/blogs/blogs.service';
import { CommentsService } from 'src/comments/comments.service';
import { FetchUserDto } from 'src/users/dtos/fetch-user.dto';
import { Repository } from 'typeorm';
import { CreateReactionDto } from './dtos/create-reaction.dto';
import { EditReactionDto } from './dtos/edit-reaction.dto';
import { Reaction } from './reaction.entity';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectRepository(Reaction) private repo: Repository<Reaction>,
    private blogsService: BlogsService,
    private commentsService: CommentsService,
  ) {}

  find() {
    return this.repo.find();
  }

  async findById(id: string) {
    const reaction = await this.repo.findOneBy({ id });
    if (!reaction) throw new NotFoundException('Reaction not found');
    return reaction;
  }

  // react to a post or a comment
  async create(reaction: CreateReactionDto, user: FetchUserDto) {
    const { type, blogId, commentId } = reaction;
    let newReaction: Partial<Reaction>;
    if (blogId && !commentId) {
      // check if user is reacting to a blog post
      const blog = await this.blogsService.findById(blogId);
      if (!blog) throw new NotFoundException('Blog not found');
      newReaction = this.repo.create({ type, blog, user });
    } else if (commentId && !blogId) {
      // check if user is reacting to a comment
      const comment = await this.commentsService.findById(commentId);
      if (!comment) throw new NotFoundException('Comment not found');
      newReaction = this.repo.create({ type, comment, user });
    } else
      throw new BadRequestException(
        'Provide either the comment or the blog post',
      );
    return this.repo.save(newReaction);
  }

  async update(id: string, attrs: EditReactionDto) {
    const reaction = await this.findById(id);
    Object.assign(reaction, attrs);
    return this.repo.save(reaction);
  }

  delete(id: string) {
    return this.repo.delete({ id });
  }
}
