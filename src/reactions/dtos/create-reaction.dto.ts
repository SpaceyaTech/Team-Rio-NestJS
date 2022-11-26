import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ReactionEnum, ReactionType } from '../reaction.entity';

export class CreateReactionDto {
  @ApiProperty({ type: 'enum', enum: ReactionEnum, example: 'upvote' })
  @IsEnum(ReactionEnum)
  type: ReactionType;

  @ApiPropertyOptional({
    type: 'uuid',
    example: '9866ffea-385f-4bdf-b78b-5fc8ffbda883',
  })
  @IsOptional()
  @IsUUID()
  blogId?: string | null;

  @ApiPropertyOptional({
    type: 'uuid',
    example: '9866ffea-385f-4bdf-b78b-5fc8ffbda883',
  })
  @IsOptional()
  @IsUUID()
  commentId?: string | null;
}
