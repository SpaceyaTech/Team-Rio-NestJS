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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequireAuth } from 'src/auth/guards/require-auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { FetchUserDto } from 'src/users/dtos/fetch-user.dto';
import { BlogsService } from './blogs.service';
import { EditBlogDto } from './dtos/edit-blog.dto';
import { FetchBlogDto } from './dtos/fetch-blog.dto';
import { CreateBlogInterceptor } from './interceptors/create-blog.interceptor';

@Controller('blogs')
@ApiTags('Blogs')
@Serialize(FetchBlogDto)
export class BlogsController {
  constructor(private service: BlogsService) {}

  @ApiOperation({
    summary: 'Get all blogs',
    description: 'Gets all the blogs stored in the database',
  })
  @Get()
  getBlogs() {
    return this.service.find();
  }

  @ApiOperation({
    summary: 'Get a single blog post',
    description:
      "Fetch a single blog by it's ID. If blog does\
      not exist it returns a 404 error",
  })
  @Get(':id')
  getBlog(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @ApiOperation({
    summary: 'Create a blog post',
    description:
      'Create a blog post. Requires a user to be authenticated\
    by default the blog is not published but instead it is saved as a draft.\
    For the frontend a rich text editor such as TinyMCE will be used to write blogs',
  })
  @Post()
  @UseGuards(RequireAuth)
  createBlog(@Body() body: any, @CurrentUser() user: FetchUserDto) {
    return this.service.create(body, user);
  }

  @ApiOperation({
    summary: 'Edit a blog post',
    description:
      'Change the contents of a blog post and the categories it belongs to',
  })
  @Patch(':id')
  @UseGuards(RequireAuth)
  editBlog(@Param('id') id: string, @Body() body: EditBlogDto) {
    return this.service.update(id, body);
  }

  @ApiOperation({
    summary: 'Publish a blog',
    description:
      'Once a user finishes writing and proofreading a blog post they\
    can publish it for the world to see their amazing work',
  })
  @Patch(':id/publish')
  @UseGuards(RequireAuth)
  publishBlog(@Param('id') id: string) {
    return this.service.update(id, { isPublished: true });
  }

  @ApiOperation({
    summary: 'Delete a blog post',
    description:
      "Deletes a blog post. When a blog post is deleted, this will delete\
    the corresponding comments and reactions. Before deleteing the blog create a prompt\
    that confirms the user's action to avoid accidental deletion since this action is permanent",
  })
  @Delete(':id')
  @UseGuards(RequireAuth)
  deleteBlog(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
