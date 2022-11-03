import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { EditBlogDto } from './dtos/edit-blog.dto';
import { CreateBlogInterceptor } from './interceptors/create-blog.interceptor';

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
  @UseInterceptors(CreateBlogInterceptor)
  createBlog(@Body() body: any) {
    return this.service.create(body);
  }

  @Patch(':id')
  editBlog(@Param('id') id: string, @Body() body: EditBlogDto) {
    return this.service.update(id, body);
  }

  @Patch(':id/publish')
  publishBlog(@Param('id') id: string) {
    return this.service.update(id, { isPublished: true });
  }

  @Delete(':id')
  deleteBlog(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
