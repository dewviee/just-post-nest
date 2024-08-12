import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import { AccessTokenEntity } from 'src/common/entities/post/session-access-token.entity';
import { RefreshTokenEntity } from 'src/common/entities/post/session-refresh-token.entity';
import { UserEntity } from 'src/common/entities/post/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordService } from './password.service';
import { SessionService } from './session.service';
import { TokenService } from './token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      AccessTokenEntity,
      RefreshTokenEntity,
    ]),
    CommonModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, PasswordService, SessionService, TokenService],
  exports: [SessionService],
})
export class AuthModule {}
