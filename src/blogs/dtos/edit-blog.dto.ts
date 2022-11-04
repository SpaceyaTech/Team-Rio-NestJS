import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class EditBlogDto {
  @ApiPropertyOptional({ name: 'title', type: 'string', example: 'Foo' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ name: 'description', type: 'string', example: 'Bar' })
  @IsString()
  description: string;

  @ApiPropertyOptional({
    name: 'content',
    type: 'string',
    example: 'The quick brown fox jumped over the lazy dog',
  })
  @IsString()
  content: string;
}
