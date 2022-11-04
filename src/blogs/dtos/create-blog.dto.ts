import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({ name: 'title', type: 'string', example: 'Lorem Ipsum' })
  @IsString()
  title: string;

  @ApiProperty({
    name: 'description',
    type: 'string',
    example: 'Dolor met',
  })
  @IsString()
  description: string;

  @ApiProperty({
    name: 'content',
    type: 'string',
    example: 'The quick brown fox jumped over the lazy dog',
  })
  @IsString()
  content: string;
}
