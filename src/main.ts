import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { expand } from 'dotenv-expand';
import { config } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

expand(config());

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // удаляет поля, которых нет в DTO
      forbidNonWhitelisted: true, // ошибка, если прислали лишнее поле
      transform: true, // включить class-transformer
      transformOptions: {
        enableImplicitConversion: true, // автоматически приводит типы
      },
    }),
  );
  app.enableCors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
    exposedHeaders: ['set-cookie'],
  });

  const config = new DocumentBuilder()
    .setTitle('Shop')
    .setDescription('The shop API description')
    .setVersion('1.0')
    .addTag('shop')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  console.log(`Server running on port ${process.env.PORT ?? 3344}`);
  await app.listen(process.env.PORT ?? 3344);
}
bootstrap().catch((err) => {
  console.error('Error during application bootstrap:', err);
});
