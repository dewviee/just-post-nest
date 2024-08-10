import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessTokenEntity } from 'src/common/entities/post/session-access-token.entity';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([AccessTokenEntity])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
