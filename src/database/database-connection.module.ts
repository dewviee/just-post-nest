import { Global, Module } from '@nestjs/common';
import { PostConnectionProvider } from './datasource/post/post-connection.provider';

@Global()
@Module({
  providers: [PostConnectionProvider],
  exports: [PostConnectionProvider],
})
export class DatabaseConnectionModule {}
