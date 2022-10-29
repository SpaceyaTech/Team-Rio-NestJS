import { IsString } from 'class-validator';

export class EditBlogDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  content: string;
}
