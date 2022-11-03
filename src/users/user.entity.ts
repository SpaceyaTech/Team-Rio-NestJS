import { BlogPost } from 'src/blogs/blog.entity';
import { Role } from 'src/roles/role.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
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

  @Column({ type: 'text', nullable: true })
  bio: string;

  // @Column({ type: 'enum', enum: AccountStatus, default: AccountStatus.ACTIVE })
  // accountStatus: AccountStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => BlogPost, (blogPost) => blogPost.author)
  blogs: BlogPost[];

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;
}
