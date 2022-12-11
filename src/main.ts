import * as fs from 'node:fs';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './filters/allExceptions.filter';

async function bootstrap() {
  if (!fs.existsSync('temp')) {
    await fs.promises.mkdir('temp');
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
  app.enableCors({
    origin: process.env.CLIENT_ORIGIN || '*',
    methods: 'GET,POST,PUT,PATCH,DELETE',
    credentials: true,  // accept cookies from client
  });
  app.use(cookieParser());
  await app.listen(process.env.PORT || 8080);
}
bootstrap();
