import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { config } from 'dotenv';
import { AppModule } from './app.module';
import getEnv from './utils/get-env';

config({ path: `${getEnv()}` });
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

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
