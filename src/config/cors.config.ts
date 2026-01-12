import { getEnv } from './env.helper';
import { INestApplication } from '@nestjs/common';

export default function setupCors(app: INestApplication): void {
  app.enableCors({
    origin: [getEnv('CLIENT_URL')],
    credentials: true,
    exposedHeaders: ['set-cookie'],
  });
}
