import { Expose, Type } from 'class-transformer';
import { FetchUserDto } from '../../users/dtos/fetch-user.dto';

export class AuthorDto {
  @Expose()
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  avatar: string;
}

export class FetchBlogDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  slug: string;

  @Expose()
  description: string;

  @Expose()
  content: string;

  @Expose()
  @Type(() => AuthorDto)
  author: AuthorDto;

  @Expose()
  isPublisehd: boolean;
}
