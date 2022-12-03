import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

const { db } = config();

@Module({
  imports: [
    TypeOrmModule.forRoot(db),
    PrometheusModule.register({
      path: '/metrics',
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.logstash(),
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
    RolesModule,
    UsersModule,
    BlogsModule,
    AuthModule,
    CommentsModule,
    ReactionsModule,
    CategoriesModule,
  ],
  providers: [{ provide: 'APP_INTERCEPTOR', useClass: LoggingInterceptor }],
})
export class AppModule {}
