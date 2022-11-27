import * as fs from 'node:fs';
import { InternalServerErrorException, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AuthGuard } from './guards/auth.guard';
import { AllExceptionFilter, handleException } from './filters/allExceptions.filter';
import { createProxyMiddleware } from 'http-proxy-middleware';

const {
  AUTH_SERVER_API_KEY,
  AUTH_SERVER_HOST,
  AUTH_SERVER_TIMEOUT,
  CLIENT_HOST,
  PORT,
} = process.env;

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
    origin: CLIENT_HOST || '*',
    methods: 'GET,POST,PUT,PATCH,DELETE',
  });
  app.use('/auth', createProxyMiddleware({
    target: AUTH_SERVER_HOST,
    changeOrigin: true,
    timeout: AUTH_SERVER_TIMEOUT ? Number(AUTH_SERVER_TIMEOUT) : 3000,
    headers: { 'x-api-key': AUTH_SERVER_API_KEY },
    pathRewrite: (path) => path.replace('/auth', ''),
    onError: (err, req, res) => handleException(new InternalServerErrorException('Internal Proxy Error.'), req, res),
  }));
  await app.listen(PORT || 8080);
}
bootstrap();
