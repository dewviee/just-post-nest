import { config } from 'dotenv';
import getEnv from './src/utils/get-env';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import * as path from 'path';

config({ path: getEnv() });

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) ?? 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  entities: [path.resolve('**/entities/*.entity.{ts,js}')],
  migrations: [path.resolve('**/migrations/*.ts')],
  migrationsTableName: 'custom_migration_table',
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: false,
};

export default new DataSource(dataSourceOptions);
