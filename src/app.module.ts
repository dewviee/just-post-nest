import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import getEnv from './utils/get-env';
import { DatabaseConnectionModule } from './database/database-connection.module';
import { PostModule } from './v1/post/post.module';
import { postDataSourceOptions } from './database/datasource/post/post.datasource';

@Module({
  imports: [
    DatabaseConnectionModule,
    ConfigModule.forRoot({
      envFilePath: getEnv(),
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(postDataSourceOptions),
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
