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
import { RequireAuth } from 'src/auth/guards/require-auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { FetchUserDto } from 'src/users/dtos/fetch-user.dto';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dtos/create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private service: CommentsService) {}

  @Get()
  getComments() {
    return this.service.find();
  }

  @Get(':id')
  getComment(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  @UseGuards(RequireAuth)
  postComment(
    @Body() body: CreateCommentDto,
    @CurrentUser() user: FetchUserDto,
  ) {
    return this.service.create(body, user);
  }

  @Patch(':id')
  @UseGuards(RequireAuth)
  editComment(@Param('id') id: string, @Body() body: any) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  @UseGuards(RequireAuth)
  deleteComment(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
