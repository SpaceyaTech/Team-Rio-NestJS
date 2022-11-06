import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class EditCommentDto {
  @ApiProperty({ type: 'string', example: 'Please expound on the topic !' })
  @IsString()
  content: string;
}
