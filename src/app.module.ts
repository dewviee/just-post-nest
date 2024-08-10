import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AuthGuard } from './common/guards/auth.guard';
import { TokenRevokeGuard } from './common/guards/token-revoke.guard';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { DatabaseConnectionModule } from './database/database-connection.module';
import { postDataSourceOptions } from './database/datasource/post/post.datasource';
import getEnv from './utils/get-env';
import { AuthModule } from './v1/auth/auth.module';
import { PostModule } from './v1/post/post.module';
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
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: TokenRevokeGuard },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    AppService,
  ],
})
export class AppModule {}
