import { Logger } from '@nestjs/common';
import { config } from 'dotenv';
import getEnv from 'src/utils/get-env';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

config({ path: getEnv() });

export const postDataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) ?? 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  entities: ['**/entities/post/*.entity.js'],
  migrations: ['**/migrations/*.js'],
  migrationsTableName: 'custom_migration_table',
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: false,
};

export const AppDataSource = new DataSource(postDataSourceOptions);

AppDataSource.initialize()
  .then(() => {
    Logger.log('DataSource initialized', 'AppDataSource');
  })
  .catch((error) => {
    Logger.error(
      'Error during Data Source initialization' + JSON.stringify(error),
      'AppDataSource',
    );
    throw error;
  });
