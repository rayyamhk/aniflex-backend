import * as fs from 'node:fs';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AuthGuard } from './guards/auth.guard';
import { AllExceptionFilter } from './filters/allExceptions.filter';

async function bootstrap() {
  if (!fs.existsSync('temp')) {
    await fs.promises.mkdir('temp');
  }

  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);
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
  app.useGlobalGuards(new AuthGuard(reflector));
  app.enableCors({
    origin: process.env.CLIENT_ORIGIN || '*',
    methods: 'GET,POST,PUT,PATCH,DELETE',
  });
  await app.listen(process.env.PORT || 8080);
}
bootstrap();
