import { config } from 'dotenv';
import getEnv from './src/utils/get-env';
import { DataSource } from 'typeorm';
import { postDataSourceOptions } from './src/database/datasource/post/post.datasource';

config({ path: getEnv() });

export default new DataSource({
  ...postDataSourceOptions,
  entities: ['**/entities/post/*.entity.ts'],
  migrations: ['**/migrations/*.ts'],
});
