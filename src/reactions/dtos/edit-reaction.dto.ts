import { IsEnum } from 'class-validator';
import { ReactionType } from '../reaction.entity';

export class EditReactionDto {
  @IsEnum(ReactionType)
  type: ReactionType;
}
