import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogsModule } from './blogs/blogs.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { CommentsModule } from './comments/comments.module';
import { ReactionsModule } from './reactions/reactions.module';
import { CategoriesModule } from './categories/categories.module';
import { ConfigModule } from '@nestjs/config';
import config from './config';

const { db } = config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: db.database,
      synchronize: db.synchronize,
      autoLoadEntities: db.autoLoadEntities,
    }),
    ConfigModule.forRoot({
      isGlobal: true, // set the config file to global
      ignoreEnvFile: true, // we will load our own custom config file
      load: [config], // load custom config file
    }),
    BlogsModule,
    UsersModule,
    AuthModule,
    RolesModule,
    CommentsModule,
    ReactionsModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
