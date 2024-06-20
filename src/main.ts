import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import getEnv from './utils/get-env';
import { config } from 'dotenv';

config({ path: `${getEnv()}` });
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT);
}
bootstrap();
