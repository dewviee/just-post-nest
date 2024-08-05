import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import getEnv from './utils/get-env';
import { config } from 'dotenv';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

config({ path: `${getEnv()}` });
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.setGlobalPrefix('/api');

  app.use(cookieParser());

  dayjs.extend(utc);
  dayjs.extend(timezone);

  dayjs.tz.setDefault(process.env.TZ);
  await app.listen(process.env.PORT);
}
bootstrap();
