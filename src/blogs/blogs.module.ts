import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';

@Module({
  providers: [BlogsService],
  controllers: [BlogsController]
})
export class BlogsModule {}
