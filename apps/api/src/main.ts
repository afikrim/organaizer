import 'reflect-metadata';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const port = parseInt(process.env['API_PORT'] ?? '3000', 10);
  const basePath = process.env['API_BASE_PATH'] ?? '/v1';

  app.setGlobalPrefix(basePath.replace(/^\//, ''));
  app.useGlobalFilters(new AllExceptionsFilter());

  const rawOrigins =
    process.env['CORS_ORIGINS'] ?? 'http://localhost:4321,http://localhost:5173';
  const origins = rawOrigins.split(',').map((o) => o.trim());

  app.enableCors({
    origin: origins,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
  });

  await app.listen(port);
  console.log(`API listening on port ${port} with prefix ${basePath}`);
}

void bootstrap();
