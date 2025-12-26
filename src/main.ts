import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { expand } from 'dotenv-expand';
import { config } from 'dotenv';

expand(config());

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
    exposedHeaders: ['set-cookie'],
  });
  await app.listen(process.env.PORT ?? 3344);
}
bootstrap().catch((err) => {
  console.error('Error during application bootstrap:', err);
});
