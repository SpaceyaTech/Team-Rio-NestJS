import { BlogPost } from '../blogs/blog.entity';
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

@Entity({ name: 'comments' })
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'boolean', default: false })
  edited?: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;

  @ManyToOne(() => BlogPost, (blog) => blog.comments, { onDelete: 'CASCADE' })
  blog: BlogPost;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Reaction, (reaction) => reaction.comment)
  reactions?: Reaction;

  constructor(id: string, content: string, blog?: BlogPost, user?: User) {
    this.id = id;
    this.content = content;
    this.blog = blog || null;
    this.user = user || null;
  }
}
