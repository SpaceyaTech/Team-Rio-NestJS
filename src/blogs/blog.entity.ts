import { Comment } from '../comments/comment.entity';
import { Reaction } from '../reactions/reaction.entity';
import { User } from '../users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'blog_posts' })
export class BlogPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column('text')
  content: string;

  @ManyToOne(() => User, (user) => user.blogs)
  author: User;

  @Column({ type: 'boolean', default: false, name: 'is_published' })
  isPublished?: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;

  @OneToMany(() => Comment, (comment) => comment.blog)
  comments?: Comment[];

  @OneToMany(() => Reaction, (reaction) => reaction.blog)
  reactions?: Reaction[];
}
