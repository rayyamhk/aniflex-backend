import * as fs from 'fs';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AuthGuard } from './guards/auth.guard';
import { AllExceptionFilter } from './filters/allExceptions.filter';

async function bootstrap() {
  if (!fs.existsSync('temp')) {
    await fs.promises.mkdir('temp');
  }

  if (!fs.existsSync('static/thumbnails')) {
    await fs.promises.mkdir('static/thumbnails', { recursive: true });
  }

  if (!fs.existsSync('static/videos')) {
    await fs.promises.mkdir('static/videos', { recursive: true });
  }

  const app = await NestFactory.create(AppModule);
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
      permittedCrossDomainPolicies: false,
    }),
  );
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove unnecessary fields
    }),
  );
  app.useGlobalGuards(new AuthGuard());
  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE',
  });
  await app.listen(process.env.PORT || 8080);
}
bootstrap();
