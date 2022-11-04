import { BlogPost } from 'src/blogs/blog.entity';
import { Comment } from 'src/comments/comment.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ReactionType {
  UPVOTE = 'upvote',
  DOWNVOTE = 'downvote',
}

@Entity({ name: 'reactions' })
export class Reaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @Column({ type: 'enum', enum: ReactionType })
  // type: ReactionType;

  @Column()
  type: string;

  @ManyToOne(() => User, (user) => user.reactions)
  user: User;

  @ManyToOne(() => BlogPost, (blog) => blog.reactions)
  blog: BlogPost;

  @ManyToOne(() => Comment, (comment) => comment.reactions)
  comment: Comment;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
