import { Module } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { ReactionsController } from './reactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reaction } from './reaction.entity';
import { BlogsModule } from 'src/blogs/blogs.module';
import { CommentsModule } from 'src/comments/comments.module';

@Module({
  exports: [ReactionsService],
  imports: [TypeOrmModule.forFeature([Reaction]), BlogsModule, CommentsModule],
  providers: [ReactionsService],
  controllers: [ReactionsController],
})
export class ReactionsModule {}
