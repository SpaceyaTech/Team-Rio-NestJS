import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum RoleTypes {
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
}

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}