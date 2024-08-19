import { Body, Controller, Post } from '@nestjs/common';
import { VerifyEmailOtpDto } from './dto/verify-email-otp.dto';
import { OTPService } from './otp.service';

@Controller('otp')
export class OTPController {
  constructor(private readonly otpService: OTPService) {}

  @Post('email/send')
  async sendEmailOTP(@Body() body: any) {
    return this.otpService.sendOtpEmail(body);
  }

  @Post('email/verify')
  async verifyEmailOtp(@Body() body: VerifyEmailOtpDto) {
    return this.otpService.verifyOtpEmail(body);
  }
}
