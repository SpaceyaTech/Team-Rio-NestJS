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
import config from '../config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

const { db } = config();

@Module({
  imports: [
    TypeOrmModule.forRoot(db),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.logstash(),
            // winston.format.ms(),
            // winston.format.colorize({
            //   all: true,
            //   colors: { info: 'blue', warning: 'yellow', error: 'red' },
            // }),
          ),
        }),
        new winston.transports.File({
          filename: 'combined.log',
          format: winston.format.combine(
            winston.format.logstash(),
            winston.format.timestamp(),
          ),
        }),
      ],
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
