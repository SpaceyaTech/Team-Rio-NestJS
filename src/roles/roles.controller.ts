import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RoleDto } from './role.dto';
import { RolesService } from './roles.service';

@ApiTags('Roles')
@Controller('roles')
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
