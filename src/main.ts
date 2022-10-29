import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
  }

  await app.listen(5000);
}

bootstrap();
