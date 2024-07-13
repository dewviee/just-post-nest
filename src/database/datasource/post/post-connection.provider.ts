import { DataSource } from 'typeorm';
import { postDataSourceOptions } from './post.datasource';

export const PostConnectionProvider = {
  provide: DataSource,
  useFactory: async () => {
    let dataSource: DataSource;
    try {
      dataSource = new DataSource(postDataSourceOptions);
      await dataSource.initialize();
    } catch (error) {
      console.error(error);
    }
    return dataSource;
  },
};
