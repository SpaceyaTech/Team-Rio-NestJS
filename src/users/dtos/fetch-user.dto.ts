import { Expose } from 'class-transformer';

export class FetchUserDto {
  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  phone: string;

  @Expose()
  avatar: string;
}
