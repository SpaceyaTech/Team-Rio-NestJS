import { RefreshToken } from '../auth/refresh-token.entity';
import { BlogPost } from '../blogs/blog.entity';
import { Comment } from '../comments/comment.entity';
import { Reaction } from '../reactions/reaction.entity';
import { Role } from '../roles/role.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum AccountStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column()
  password: string;

  @Column({ default: 'https://bit.ly/3Wgeq06' })
  avatar?: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  // @Column({ type: 'enum', enum: AccountStatus, default: AccountStatus.ACTIVE })
  // accountStatus: AccountStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;

  @OneToMany(() => BlogPost, (blogPost) => blogPost.author)
  blogs?: BlogPost[];

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable()
  roles?: Role[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments?: Comment[];

  @OneToMany(() => Reaction, (reaction) => reaction.user)
  reactions?: Reaction[];

  @OneToOne(() => RefreshToken, (token) => token.user)
  tokens?: RefreshToken;
}
