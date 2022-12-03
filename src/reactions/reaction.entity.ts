import { BlogPost } from '../blogs/blog.entity';
import { Comment } from '../comments/comment.entity';
import { User } from '../users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from '../accounts/entities/account.entity';

export enum ReactionEnum {
  UPVOTE = 'upvote',
  DOWNVOTE = 'downvote',
}

export type ReactionType = ReactionEnum.UPVOTE | ReactionEnum.DOWNVOTE;

@Entity({ name: 'reactions' })
export class Reaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @Column({ type: 'enum', enum: ReactionType })
  // type: ReactionType;

  @Column()
  type: ReactionType;

  @ManyToOne(() => Account, (account) => account.reactions)
  account: Account;

  @ManyToOne(() => BlogPost, (blog) => blog.reactions)
  blog?: BlogPost;

  @ManyToOne(() => Comment, (comment) => comment.reactions)
  comment?: Comment;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  constructor(
    id: string,
    type: ReactionType,
    account?: Account,
    blog?: BlogPost,
    comment?: Comment,
  ) {
    this.id = id;
    this.type = type;
    this.account = account || null;
    this.blog = blog || null;
    this.comment = comment || null;
  }
}
