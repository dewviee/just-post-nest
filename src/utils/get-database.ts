import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function getDBConfig(): TypeOrmModuleOptions {
  const options: TypeOrmModuleOptions = {
    type: 'postgres',
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) ?? 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    entities: ['**/*.entity.ts}'],
    synchronize: false,
  };

  return options;
}
