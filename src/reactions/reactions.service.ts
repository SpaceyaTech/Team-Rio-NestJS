import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FetchUserDto } from '../users/dtos/fetch-user.dto';
import { Repository } from 'typeorm';
import { CreateReactionDto } from './dtos/create-reaction.dto';
import { EditReactionDto } from './dtos/edit-reaction.dto';
import { Reaction, ReactionType } from './reaction.entity';

type FindFilters = {
  type: string;
  id: string;
};

export enum ReactionFilterTypes {
  BLOG = 'blog',
  COMMENT = 'comment',
}

@Injectable()
export class ReactionsService {
  constructor(@InjectRepository(Reaction) private repo: Repository<Reaction>) {}

  find() {
    return this.repo.find({
      relations: { blog: true, user: true, comment: true },
    });
  }

  async findByAndCount(filters: FindFilters) {
    let upVotes: number = 0;
    let downVotes: number = 0;
    let total: number = 0;
    if (filters.type === ReactionFilterTypes.BLOG) {
      upVotes = await this.repo.count({
        where: { blog: { id: filters.id }, type: ReactionType.UPVOTE },
      });
      downVotes = await this.repo.count({
        where: { blog: { id: filters.id }, type: ReactionType.DOWNVOTE },
      });
      total = await this.repo.count({ where: { blog: { id: filters.id } } });
    } else if (filters.type === ReactionFilterTypes.COMMENT) {
      upVotes = await this.repo.count({
        where: { comment: { id: filters.id }, type: ReactionType.UPVOTE },
      });
      downVotes = await this.repo.count({
        where: { comment: { id: filters.id }, type: ReactionType.DOWNVOTE },
      });
      total = await this.repo.count({
        where: { comment: { id: filters.id } },
      });
    } else throw new InternalServerErrorException('Invalid reaction filter');
    return { upVotes, downVotes, total };
  }

  async findById(id: string) {
    const reaction = await this.repo.find({
      where: { id },
      relations: { blog: true, comment: true },
    });
    if (!reaction) throw new NotFoundException('Reaction not found');
    return reaction;
  }

  // react to a post or a comment
  async create(reaction: CreateReactionDto, user: FetchUserDto) {
    const { type, blogId, commentId } = reaction;
    let newReaction: Partial<Reaction>;
    if (blogId && !commentId) {
      // check if user is reacting to a blog post
      const [existingReaction] = await this.repo.find({
        where: { user: { id: user.id }, blog: { id: blogId } },
      });
      if (existingReaction)
        // check if the reaction exists
        throw new BadRequestException('You have already reacted to this post');
      newReaction = this.repo.create({ type, blog: { id: blogId }, user });
    } else if (commentId && !blogId) {
      // check if user is reacting to a comment
      const [existingReaction] = await this.repo.find({
        where: { user: { id: user.id }, comment: { id: commentId } },
      });
      if (existingReaction)
        // check if reaction exists
        throw new BadRequestException(
          'You have already reacted to this comment',
        );
      newReaction = this.repo.create({
        type,
        comment: { id: commentId },
        user,
      });
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
