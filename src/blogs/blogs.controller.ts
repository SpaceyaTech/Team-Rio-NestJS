import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dtos/create-blog.dto';
import { EditBlogDto } from './dtos/edit-blog.dto';

@Controller('blogs')
export class BlogsController {
  constructor(private service: BlogsService) {}

  @Get()
  getBlogs() {
    return this.service.find();
  }

  @Get(':id')
  getBlog(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  createBlog(@Body() body: CreateBlogDto) {
    return this.service.create(body);
  }

  @Patch(':id')
  editBlog(@Param('id') id: string, @Body() body: EditBlogDto) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  deleteBlog(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
