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
import { CreateUserDto } from './dtos/create-user.dto';
import { EditUserDto } from './dtos/edit-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private service: UsersService) {}

  @Get()
  getUsers() {
    return this.service.find();
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  createUser(@Body() body: CreateUserDto) {
    return this.service.create(body);
  }

  @Patch(':id')
  editUser(@Param('id') id: string, @Body() body: EditUserDto) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
