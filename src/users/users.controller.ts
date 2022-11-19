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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../guards/roles.guard';
import { CreateUserDto } from './dtos/create-user.dto';
import { EditUserDto } from './dtos/edit-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
// @Roles(RoleTypes.ADMIN) // only admins can create users and manage users
@UseGuards(RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  // GET users
  @ApiOperation({
    summary: 'Get all users',
    description: 'Fetches all the users in our database',
  })
  @Get()
  getUsers() {
    return this.service.find();
  }

  // GET users with a particular role
  @ApiOperation({
    summary: 'Get users with a particular role',
    description:
      'Fetch a lost of users with a particular role. For example,\
       fetching all the admin users in the database',
  })
  @Get('/role')
  getUsersRole(@Query('roleId') roleId: string) {
    return this.service.findByRole(roleId);
  }

  // GET a user
  @ApiOperation({
    summary: 'Get a single user',
    description: 'Fetch a single user from tha database',
  })
  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.service.findById(id);
  }

  // POST a user
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Adds a user to our database',
  })
  @Post()
  createUser(@Body() body: CreateUserDto) {
    return this.service.create(body);
  }

  // PATCH a usser
  @ApiOperation({
    summary: 'Edit a user',
    description: "Update a user's information",
  })
  @Patch(':id')
  editUser(@Param('id') id: string, @Body() body: EditUserDto) {
    return this.service.update(id, body);
  }

  @ApiOperation({
    summary: 'Delete a user',
    description: "Permanently delete a user's account",
  })
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
