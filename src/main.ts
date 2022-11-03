import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as compression from 'compression';
import * as passport from 'passport';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
const session = require('express-session');
const cookieParser = require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  if (process.env.NODE_ENV === 'production') app.use(helmet());
  app.use(compression()); // compress the response

  app.use(cookieParser());
  app.use(
    session({
      secret: 'hjsajk',
      resave: false,
      saveUninitialized: true,
      // cookie: { secure: true } // preferable when using https
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // setup swagger
  const config = new DocumentBuilder()
    .setTitle('SpaceYaTech Backend API')
    .setDescription(
      'Backend API for the SpaceYaTech project implemented using NestJS framework',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(5000);
}

bootstrap();
