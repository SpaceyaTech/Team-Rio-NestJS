import { SetMetadata } from '@nestjs/common';
import { RolesEnum } from '../../roles/role.entity';

export const Roles = (...roles: RolesEnum[]) => SetMetadata('roles', roles);
