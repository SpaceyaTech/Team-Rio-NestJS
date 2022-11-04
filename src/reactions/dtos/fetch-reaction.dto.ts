import { Expose, Type } from 'class-transformer';

class ReactionBlog {
  @Expose()
  id: string;
}

class ReactionComment {
  @Expose()
  id: string;
}

export class FetchReactionDto {
  @Expose()
  id: string;

  @Expose()
  type: string;

  @Expose()
  @Type(() => ReactionBlog)
  blog?: ReactionBlog;

  @Expose()
  @Type(() => ReactionComment)
  comment?: ReactionComment;
}
