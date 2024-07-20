import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import getEnv from './utils/get-env';
import { config } from 'dotenv';
import { ValidationPipe, VersioningType } from '@nestjs/common';

config({ path: `${getEnv()}` });
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.setGlobalPrefix('/api');

  await app.listen(process.env.PORT);
}
bootstrap();
