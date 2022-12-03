import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/user.entity';
import { BlogPost } from '../../blogs/blog.entity';
import { Comment } from '../../comments/comment.entity';
import { Reaction } from '../../reactions/reaction.entity';

@Entity({ name: 'users_accounts' })
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.accounts)
  user: User;

  @Column()
  name: string;

  @Column({ name: 'display_photo', default: 'https://bit.ly/3Wgeq06' })
  displayPhoto: string;

  @Column('text')
  bio: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => BlogPost, (blog) => blog.account)
  blogPosts: BlogPost[];

  @OneToMany(() => Comment, (comment) => comment.account)
  comments: Comment[];

  @OneToMany(() => Reaction, (reaction) => reaction.account)
  reactions: Reaction[];
}
