import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReactionType } from '../reaction.entity';

export class CreateReactionDto {
  @IsEnum(ReactionType)
  type: ReactionType;

  @IsOptional()
  @IsString()
  blogId?: string | null;

  @IsOptional()
  @IsString()
  commentId?: string | null;
}
