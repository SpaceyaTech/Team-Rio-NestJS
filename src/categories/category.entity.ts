import { BlogPost } from 'src/blogs/blog.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'blog-gategories' })
export class Category {
  @PrimaryColumn('varchar')
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => BlogPost, (blogPost) => blogPost.categories)
  blogPosts: BlogPost[];
}
