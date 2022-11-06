import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RequireAuth } from 'src/auth/guards/require-auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { RoleDto } from './role.dto';
import { RoleTypes } from './role.entity';
import { RolesService } from './roles.service';

@ApiTags('Roles')
@Controller('roles')
// @Roles(RoleTypes.ADMIN)
@UseGuards(RequireAuth, RolesGuard)
export class RolesController {
  constructor(private service: RolesService) {}

  // GET roles
  @ApiOperation({
    summary: 'Get all the roles',
    description: 'Fetches all the roles in the database',
  })
  @Get()
  getRoles() {
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
