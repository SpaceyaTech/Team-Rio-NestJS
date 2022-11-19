import { SetMetadata } from '@nestjs/common';
import { RoleTypes } from '../roles/role.entity';

export const Roles = (...roles: RoleTypes[]) => SetMetadata('roles', roles);
