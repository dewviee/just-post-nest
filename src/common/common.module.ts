import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { FileService } from './services/file.service';
import { JWTService } from './services/jwt.service';
import { MailerService } from './services/mailer.service';

@Global()
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [JWTService, MailerService, FileService],
  exports: [JWTService, MailerService, FileService],
})
export class CommonModule {}
