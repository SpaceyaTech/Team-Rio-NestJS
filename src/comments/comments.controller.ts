import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequireAuth } from '../common/guards/require-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { FetchUserDto } from '../users/dtos/fetch-user.dto';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { EditCommentDto } from './dtos/edit-comment.dto';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private service: CommentsService) {}

  // GET all comments
  @ApiOperation({
    summary: 'Get all comments',
    description: 'Fetch all the comments in the database',
  })
  @Get()
  getComments() {
    return this.service.find();
  }

  // GET a single a comment
  @ApiOperation({
    summary: 'Get a single comment',
    description: 'Fetch the details of a given comment',
  })
  @Get(':id')
  getComment(@Param('id') id: string) {
    return this.service.findById(id);
  }

  // GET blog comments count
  @ApiOperation({
    summary: 'Get blog comments count',
    description: 'Fetch the number of comments a blog has',
  })
  @Get(':blogId')
  getBlogCommentsCount(@Param('blogId') blogId: string) {
    return this.service.countByBlog(blogId);
  }

  // POST a comment
  @ApiOperation({
    summary: 'Post a comment',
    description: 'Used when a user wants to post a comment on a blog',
  })
  @Post()
  @UseGuards(RequireAuth)
  postComment(
    @Body() body: CreateCommentDto,
    @CurrentUser() user: FetchUserDto,
  ) {
    return this.service.create(body, user);
  }

  // PATCH a comment
  @ApiOperation({
    summary: 'Edit a comment',
    description:
      'Used when a user wants to edit their comment.\
       When a user edits a comment we can add a flag to show that\
       the user has edited the comment',
  })
  @Patch(':id')
  @UseGuards(RequireAuth)
  editComment(@Param('id') id: string, @Body() body: EditCommentDto) {
    return this.service.update(id, body);
  }

  // DELETE a comment
  @ApiOperation({
    summary: 'Delete a comment',
    description: 'Used when a user wants to delete a comment.',
  })
  @Delete(':id')
  @UseGuards(RequireAuth)
  deleteComment(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
