import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { loadEnv, getEnv } from './config/env.helper';
import { DatabaseExceptionFilter } from './common/filters/database-exception.filter';
import { setupSwagger } from './config/swigger.config';
import { setupValidation } from './config/validation.config';
import setupCors from './config/cors.config';

// Загружаем env ПЕРВЫМ делом
loadEnv();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  setupValidation(app);
  setupCors(app);
  app.useGlobalFilters(new DatabaseExceptionFilter());
  setupSwagger(app);

  console.log(`Server running on port ${getEnv('PORT')}`);
  await app.listen(+getEnv('PORT'));
}
bootstrap().catch((err) => {
  console.error('Error during application bootstrap:', err);
});
