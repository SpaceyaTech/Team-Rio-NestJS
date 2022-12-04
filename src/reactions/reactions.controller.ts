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
import { RequireAuth } from '../common/guards/require-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Serialize } from '../common/interceptors/serialize.interceptor';
import { FetchUserDto } from '../users/dtos/fetch-user.dto';
import { CreateReactionDto } from './dtos/create-reaction.dto';
import { EditReactionDto } from './dtos/edit-reaction.dto';
import { FetchReactionDto } from './dtos/fetch-reaction.dto';
import { ReactionFilterTypes, ReactionsService } from './reactions.service';

@ApiTags('Reactions')
@Controller('reactions')
export class ReactionsController {
  constructor(private service: ReactionsService) {}

  // GET all reactions
  @ApiOperation({
    summary: 'Get all the reactions in the database',
    description:
      'Fetches all the reactions regardless of being a blog post reaction\
       or a comment reaction',
  })
  @Serialize(FetchReactionDto)
  @Get()
  getReactions() {
    return this.service.find();
  }

  // GET blog reactions count
  @ApiOperation({
    summary: 'Get blog reactions count',
    description:
      "Get a summary of a particular blog's reactions,\
       the downvotes, upvotes and the total count of the reactions",
  })
  @Get('count')
  getBlogReactionsCount(@Query('blogId') blogId: string) {
    return this.service.findByAndCount({
      type: ReactionFilterTypes.BLOG,
      id: blogId,
    });
  }

  // GET comment reactions count
  @ApiOperation({
    summary: 'Get comment reactions count',
    description:
      "Get a summary of a particular article's reactions,\
       the downvotes, upvotes and the total count of the reactions",
  })
  @Get('count')
  getCommentReactionsCount(@Query('commentId') commentId: string) {
    return this.service.findByAndCount({
      type: ReactionFilterTypes.COMMENT,
      id: commentId,
    });
  }

  // GET reaction
  @ApiOperation({
    summary: 'Get a single reaction',
    description: 'Get the full detils of a reaction',
  })
  @Serialize(FetchReactionDto)
  @Get(':id')
  getReaction(@Param('id') id: string) {
    return this.service.findById(id);
  }

  // POST a reaction
  @ApiOperation({
    summary: 'Post a reaction',
    description: 'React to a blog or a comment',
  })
  @Serialize(FetchReactionDto)
  @Post()
  @UseGuards(RequireAuth)
  createReaction(
    @Body() body: CreateReactionDto,
    @CurrentUser() user: FetchUserDto,
  ) {
    return this.service.create(body, user);
  }

  // PATCH a reaction
  @ApiOperation({
    summary: 'Update a reaction',
    description:
      'Used to update a reaction. In case a user wants to downvote\
       a blog post or a comment that they previously upvoted',
  })
  @Serialize(FetchReactionDto)
  @Patch(':id')
  editReaction(@Param('id') id: string, @Body() body: EditReactionDto) {
    return this.service.update(id, body);
  }

  // DELETE reaction
  @ApiOperation({
    summary: 'Delete a reaction',
    description:
      'Used to remove a reaction. A user can upvote a blog post or\
       a comment and they can remove their reaction',
  })
  @Delete(':id')
  deleteReaction(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
