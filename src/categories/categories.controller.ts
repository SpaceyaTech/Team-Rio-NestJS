import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CategoryDto } from './dtos/category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private service: CategoriesService) {}

  @ApiOperation({
    summary: 'Get categories',
    description: 'Fetch a list of all categories',
  })
  @Get()
  getCategories() {
    return this.service.find();
  }

  @ApiOperation({
    summary: 'Get blogs in a category',
    description: 'Fetch all blogs within a certain category',
  })
  @Get('blogs')
  getBlogsByCategory(@Param('category') category: string) {
    return this.service.findBlogsByCategory(category);
  }

  @ApiOperation({
    summary: 'Get a category',
    description: 'Fetch a single category',
  })
  @Get(':name')
  getCategory(@Param('name') name: string) {
    return this.service.findOne(name);
  }

  @ApiOperation({
    summary: 'Create a category',
    description: 'Create a new category',
  })
  @Post()
  createCategoy(@Body() body: CategoryDto) {
    return this.service.create(body);
  }

  @ApiOperation({
    summary: 'Edit a category',
    description: 'Edit the name of a category',
  })
  @Patch(':name')
  editCategory(@Param('name') name: string, @Body() body: CategoryDto) {
    return this.service.update(name, body);
  }

  @ApiOperation({
    summary: 'Delete a category',
    description: 'Delete a category by name',
  })
  @Delete(':name')
  deleteCategory(@Param('name') name: string) {
    return this.service.delete(name);
  }
}
