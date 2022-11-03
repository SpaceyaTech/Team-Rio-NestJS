import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleDto } from './role.dto';
import { RolesService } from './roles.service';

@Controller('roles')
@ApiTags('Roles')
export class RolesController {
  constructor(private service: RolesService) {}

  @Get()
  getRoles() {
    return this.service.find();
  }

  @Get(':id')
  getRole(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  createRole(@Body() body: RoleDto) {
    return this.service.create(body);
  }

  @Patch(':id')
  editRole(@Param('id') id: string, @Body() body: RoleDto) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  deleteRole(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
