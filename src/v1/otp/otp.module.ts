import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { OTPController } from './otp.controller';
import { OTPService } from './otp.service';

@Module({
  imports: [CommonModule],
  controllers: [OTPController],
  providers: [OTPService],
  exports: [OTPService],
})
export class OTPModule {}
