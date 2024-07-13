import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDBConfig } from './utils/get-database';
import { ConfigModule } from '@nestjs/config';
import getEnv from './utils/get-env';
import { DatabaseConnectionModule } from './database/database-connection.module';

@Module({
  imports: [
    DatabaseConnectionModule,
    ConfigModule.forRoot({
      envFilePath: getEnv(),
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(getDBConfig()),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
