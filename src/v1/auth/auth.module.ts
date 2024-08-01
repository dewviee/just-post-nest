import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/common/entities/post/user.entity';
import { PasswordService } from './password.service';
import { CommonModule } from 'src/common/common.module';
import { SessionService } from './session.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), CommonModule],
  controllers: [AuthController],
  providers: [AuthService, PasswordService, SessionService],
})
export class AuthModule {}
