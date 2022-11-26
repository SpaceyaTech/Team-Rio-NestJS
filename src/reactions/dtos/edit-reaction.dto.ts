import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ReactionEnum, ReactionType } from '../reaction.entity';

export class EditReactionDto {
  @ApiProperty({ type: 'enum', enum: ReactionEnum, example: 'downvote' })
  @IsEnum(ReactionEnum)
  type: ReactionType;
}
