import { BadRequestException, Injectable } from '@nestjs/common';
import * as ejs from 'ejs';
import { ETemplateFileName } from 'src/common/enum/template-file.enum';
import { FileService } from 'src/common/services/file.service';
import { MailerService } from 'src/common/services/mailer.service';
import { SendEmailOtpDto } from './dto/send-email-otp.dto';
import { VerifyEmailOtpDto } from './dto/verify-email-otp.dto';

@Injectable()
export class OTPService {
  private mockCode: string;
  private mockRef: string;

  constructor(
    private readonly mailerService: MailerService,
    private readonly fileService: FileService,
  ) {
    [this.mockCode, this.mockRef] = ['123456', 'abcd'];
  }

  // TODO: Implement real OTP for this
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async sendOtpEmail(body: SendEmailOtpDto) {
    const template = this.fileService.readEjsTemplateFile(
      ETemplateFileName.OTP_EMAIL,
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const html = ejs.render(template, {
      otpCode: this.mockCode,
      refCode: this.mockRef,
    });

    return { ref: this.mockRef };
    // return await this.mailerService.sendEmail(
    //   'Request OTP',
    //   body.email,
    //   html,
    //   'HTML',
    // );
  }

  async verifyOtpEmail(body: VerifyEmailOtpDto) {
    if (!(body.code == this.mockCode && body.ref == this.mockRef)) {
      throw new BadRequestException('otp not match');
    }
  }
}
