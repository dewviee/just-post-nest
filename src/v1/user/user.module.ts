import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessTokenEntity } from 'src/common/entities/post/access-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccessTokenEntity])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
