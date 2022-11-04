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
import { ApiTags } from '@nestjs/swagger';
import { RequireAuth } from 'src/auth/guards/require-auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { FetchUserDto } from 'src/users/dtos/fetch-user.dto';
import { CreateReactionDto } from './dtos/create-reaction.dto';
import { EditReactionDto } from './dtos/edit-reaction.dto';
import { ReactionFilterTypes, ReactionsService } from './reactions.service';

@ApiTags('Reactions')
@Controller('reactions')
export class ReactionsController {
  constructor(private service: ReactionsService) {}

  @Get()
  getReactions() {
    return this.service.find();
  }

  @Get('count')
  getBlogReactionsCount(@Query('blogId') blogId: string) {
    return this.service.findByAndCount({
      type: ReactionFilterTypes.BLOG,
      id: blogId,
    });
  }

  @Get('count')
  getCommentReactionsCount(@Query('commentId') commentId: string) {
    return this.service.findByAndCount({
      type: ReactionFilterTypes.COMMENT,
      id: commentId,
    });
  }

  @Get(':id')
  getReaction(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  @UseGuards(RequireAuth)
  postReaction(
    @Body() body: CreateReactionDto,
    @CurrentUser() user: FetchUserDto,
  ) {
    return this.service.create(body, user);
  }

  @Patch(':id')
  editReaction(@Param('id') id: string, @Body() body: EditReactionDto) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  deleteReaction(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
