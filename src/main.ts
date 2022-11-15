import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AuthGuard } from './guards/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
      permittedCrossDomainPolicies: false,
    }),
  );
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
  await app.listen(3001);
}
bootstrap();
