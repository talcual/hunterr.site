import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

let cachedApp: NestExpressApplication | null = null;

export async function createApp(): Promise<NestExpressApplication> {
  if (cachedApp) return cachedApp;

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  const config = app.get(ConfigService);

  app.setGlobalPrefix(config.get<string>('API_PREFIX') ?? 'api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const origins = (config.get<string>('CORS_ORIGIN') ?? 'http://localhost:4321')
    .split(',')
    .map((s) => s.trim());
  app.enableCors({
    origin: origins,
    credentials: true,
  });

  await app.init();
  cachedApp = app;
  return app;
}

async function bootstrap() {
  const app = await createApp();
  const config = app.get(ConfigService);
  const port = Number(config.get<string>('PORT') ?? 3001);
  await app.listen(port);
  console.log(`Hunterrd API running on http://localhost:${port}/${config.get<string>('API_PREFIX') ?? 'api/v1'}`);
}

if (require.main === module) {
  bootstrap();
}
