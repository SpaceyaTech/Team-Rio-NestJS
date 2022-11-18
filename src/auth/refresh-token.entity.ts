import { User } from 'src/users/user.entity';
import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'tokens' })
export class RefreshToken {
  @PrimaryColumn('uuid')
  token: string;

  @OneToOne(() => User, (user) => user.tokens)
  user: User;

  @Column('datetime')
  expires: Date;
}
