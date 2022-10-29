import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogsModule } from './blogs/blogs.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [BlogsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
