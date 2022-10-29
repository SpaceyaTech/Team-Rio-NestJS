import { BlogPost } from 'src/blogs/blog.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

enum AccountStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  password: string;

  @Column({ default: 'https://bit.ly/3Wgeq06' })
  avatar: string;

  @Column('text')
  bio: string;

  @Column({ type: 'enum', enum: AccountStatus, default: AccountStatus.ACTIVE })
  accountStatus: AccountStatus;

  @OneToMany(() => BlogPost, (blogPost) => blogPost.author)
  blogs: BlogPost[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
