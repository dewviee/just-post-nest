import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { FileService } from './services/file.service';
import { JWTService } from './services/jwt.service';
import { MailerService } from './services/mailer.service';
import { PasswordService } from './services/password.service';

@Global()
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [JWTService, MailerService, FileService, PasswordService],
  exports: [JWTService, MailerService, FileService, PasswordService],
})
export class CommonModule {}
