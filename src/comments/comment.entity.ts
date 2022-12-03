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
import { Account } from 'src/accounts/entities/account.entity';

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

  @ManyToOne(() => Account, (account) => account.comments, {
    onDelete: 'CASCADE',
  })
  account: Account;

  @OneToMany(() => Reaction, (reaction) => reaction.comment)
  reactions?: Reaction;

  constructor(id: string, content: string, blog?: BlogPost, account?: Account) {
    this.id = id;
    this.content = content;
    this.blog = blog || null;
    this.account = account || null;
  }
}
