import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import { raw } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use('/webhook/payment-strapi', raw({ type: 'application/json' }));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
