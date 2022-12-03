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
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { RequireAuth } from '../auth/guards/require-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PageDto, PageOptionsDto } from '../common/dtos/page.dto';
import { Serialize } from '../common/interceptors/serialize.interceptor';
import { FetchUserDto } from '../users/dtos/fetch-user.dto';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dtos/create-blog.dto';
import { EditBlogDto } from './dtos/edit-blog.dto';
import { FetchBlogDto } from './dtos/fetch-blog.dto';

@ApiTags('Blogs')
@Serialize(FetchBlogDto)
@Controller('blogs')
export class BlogsController {
  constructor(private service: BlogsService) {}

  // GET all the blog posts
  @ApiOperation({
    summary: 'Get all blogs',
    description: 'Gets all the blogs stored in the database',
  })
  @Get()
  getBlogs(@Query() pageOptions: PageOptionsDto) {
    return this.service.find(pageOptions);
  }

  // GET a single blog post
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

  // CREATE a blog post
  @ApiOperation({
    summary: 'Create a blog post',
    description:
      'Create a blog post. Requires a user to be authenticated.\
       By default the blog is not published but instead it is saved as a draft.\
       For the frontend a rich text editor such as TinyMCE will be used to write blogs',
  })
  @ApiBody({
    type: CreateBlogDto,
    description: 'Create blog post structure',
  })
  @Post()
  @UseGuards(RequireAuth)
  createBlog(@Body() body: any, @CurrentUser() user: FetchUserDto) {
    return this.service.create(body, user);
  }

  // EDIT a blog post
  @ApiOperation({
    summary: 'Edit a blog post',
    description:
      'Change the contents of a blog post and the categories it belongs to',
  })
  @ApiBody({
    type: EditBlogDto,
    description: 'Edit blog post structure',
  })
  @Patch(':id')
  @UseGuards(RequireAuth)
  editBlog(@Param('id') id: string, @Body() body: EditBlogDto) {
    return this.service.update(id, body);
  }

  // PUBLISH a blog post
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

  // DELETE a blog post
  @ApiOperation({
    summary: 'Delete a blog post',
    description:
      "Deletes a blog post. When a blog post is deleted, this will delete\
       the corresponding comments and reactions. Before deleteing the blog create a prompt\
       that confirms the user's action to avoid accidental deletion since this action is permanent",
  })
  @ApiParam({
    name: 'id',
    type: 'uuid',
    example: 'b2994cb0-bcd3-47b2-967a-f7724acc2c0a',
  })
  @Delete(':id')
  @UseGuards(RequireAuth)
  deleteBlog(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
