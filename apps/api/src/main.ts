import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import type { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

let cachedApp: NestExpressApplication | null = null;

export async function createApp(): Promise<NestExpressApplication> {
  if (cachedApp) return cachedApp;

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  const config = app.get(ConfigService);

  app.use(cookieParser());

  app.setGlobalPrefix(config.get<string>('API_PREFIX') ?? 'api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const rawCorsOrigin = config.get<string>('CORS_ORIGIN');
  const allowSubdomains = config.get<string>('CORS_ALLOW_SUBDOMAINS') !== 'false';
  const origins = (rawCorsOrigin ?? 'http://localhost:4321')
    .split(',')
    .map((s) => s.trim());

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const exactMatch = origins.includes(origin);
      if (exactMatch) return callback(null, true);

      if (allowSubdomains) {
        for (const allowed of origins) {
          try {
            const allowedUrl = new URL(allowed);
            const allowedHost = allowedUrl.hostname;
            const originHost = new URL(origin).hostname;
            if (
              originHost === allowedHost ||
              originHost.endsWith('.' + allowedHost)
            ) {
              return callback(null, true);
            }
          } catch {
            continue;
          }
        }
      }

      callback(new Error('Not allowed by CORS'), false);
    },
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
