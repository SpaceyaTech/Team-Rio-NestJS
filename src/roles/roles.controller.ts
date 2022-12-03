import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  LoggerService,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Roles } from '../common/decorators/roles.decorator';
import { RequireAuth } from '../auth/guards/require-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { RoleDto } from './role.dto';
import { RolesEnum } from './role.entity';
import { RolesService } from './roles.service';

@ApiTags('Roles')
@Controller('roles')
@UseGuards(RequireAuth)
@Roles(RolesEnum.ADMIN)
@UseGuards(RequireAuth, RolesGuard)
export class RolesController {
  constructor(
    private service: RolesService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  // GET roles
  @ApiOperation({
    summary: 'Get all the roles',
    description: 'Fetches all the roles in the database',
  })
  @Get()
  async getRoles() {
    // this.logger.log('Fetched all roles');
    return this.service.find();
  }

  // GET users role
  @ApiOperation({
    summary: 'Get all users with a certain role',
    description: 'Fetch users who have a certain role',
  })
  @Get('users')
  getUsers(@Query('role') role: string) {
    return this.service.findUsers(role);
  }

  // GET a single role
  @ApiOperation({
    summary: 'Get a single role',
    description: 'Fetches details about a single role',
  })
  @Get(':id')
  getRole(@Param('id') id: string) {
    return this.service.findById(id);
  }

  // POST a role
  @ApiOperation({
    summary: 'Create a role',
    description:
      'Used to add a role to our system. This should be a protected\
       route so that only the admin can create a role',
  })
  @Post()
  createRole(@Body() body: RoleDto) {
    return this.service.create(body);
  }

  // PATCH a role
  @ApiOperation({
    summary: 'Edit a role',
    description: 'Used to edit particular details of a role',
  })
  @Patch(':id')
  editRole(@Param('id') id: string, @Body() body: RoleDto) {
    return this.service.update(id, body);
  }

  // DELETE a role
  @ApiOperation({
    summary: 'Delete a role',
    description: 'Permanently deletes a role from the database',
  })
  @Delete(':id')
  deleteRole(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
