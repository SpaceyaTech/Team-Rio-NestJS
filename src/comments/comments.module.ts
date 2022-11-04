import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { BlogsModule } from 'src/blogs/blogs.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';

@Module({
  exports: [CommentsService],
  imports: [TypeOrmModule.forFeature([Comment]), BlogsModule],
  providers: [CommentsService],
  controllers: [CommentsController],
})
export class CommentsModule {}
