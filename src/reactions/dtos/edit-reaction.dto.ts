import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ReactionType } from '../reaction.entity';

export class EditReactionDto {
  @ApiProperty({ type: 'enum', enum: ReactionType, example: 'downvote' })
  @IsEnum(ReactionType)
  type: ReactionType;
}
