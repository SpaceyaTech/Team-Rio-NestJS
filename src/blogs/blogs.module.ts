import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogPost } from './blog.entity';
import { UsersModule } from 'src/users/users.module';
import { CreateBlogInterceptor } from './interceptors/create-blog.interceptor';

@Module({
  exports: [BlogsService],
  imports: [TypeOrmModule.forFeature([BlogPost]), UsersModule],
  providers: [BlogsService, CreateBlogInterceptor],
  controllers: [BlogsController],
})
export class BlogsModule {}
