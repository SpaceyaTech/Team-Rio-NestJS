import { ApiProduces, ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ type: 'string', example: 'This blog is awesome !' })
  @IsString()
  content: string;

  @ApiProperty({
    type: 'uuid',
    example: '14b5f3b0-89b0-497a-a1ac-4b30f3d55a3b',
  })
  @IsString()
  blogId: string;
}
