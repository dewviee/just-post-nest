import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import getEnv from './utils/get-env';
import { DatabaseConnectionModule } from './database/database-connection.module';
import { PostModule } from './v1/post/post.module';
import { postDataSourceOptions } from './database/datasource/post/post.datasource';
import { AuthModule } from './v1/auth/auth.module';
import { CommonModule } from './common/common.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/guards/auth.guard';
import { UserModule } from './v1/user/user.module';

@Module({
  imports: [
    DatabaseConnectionModule,
    ConfigModule.forRoot({
      envFilePath: getEnv(),
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(postDataSourceOptions),
    PostModule,
    AuthModule,
    CommonModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }, AppService],
})
export class AppModule {}
