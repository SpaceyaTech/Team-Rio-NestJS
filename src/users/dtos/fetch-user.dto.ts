import { Expose, Type } from 'class-transformer';
import { Role } from 'src/roles/role.entity';

export class FetchRoleDto {
  @Expose()
  name: string;
}

export class FetchUserDto {
  @Expose()
  id: string;

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

  @Expose()
  @Type(() => FetchRoleDto)
  role: Role;

  @Expose()
  accessToken: string;
}
