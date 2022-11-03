import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RequireAuth } from 'src/auth/guards/require-auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { FetchUserDto } from 'src/users/dtos/fetch-user.dto';
import { BlogsService } from './blogs.service';
import { EditBlogDto } from './dtos/edit-blog.dto';
import { FetchBlogDto } from './dtos/fetch-blog.dto';
import { CreateBlogInterceptor } from './interceptors/create-blog.interceptor';

@Controller('blogs')
@Serialize(FetchBlogDto)
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
  @UseGuards(RequireAuth)
  createBlog(@Body() body: any, @CurrentUser() user: FetchUserDto) {
    return this.service.create(body, user);
  }

  @Patch(':id')
  @UseGuards(RequireAuth)
  editBlog(@Param('id') id: string, @Body() body: EditBlogDto) {
    return this.service.update(id, body);
  }

  @Patch(':id/publish')
  @UseGuards(RequireAuth)
  publishBlog(@Param('id') id: string) {
    return this.service.update(id, { isPublished: true });
  }

  @Delete(':id')
  @UseGuards(RequireAuth)
  deleteBlog(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
