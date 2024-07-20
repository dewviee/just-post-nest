import { Global, Module } from '@nestjs/common';
import { JWTService } from './services/jwt.service';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [JWTService],
  exports: [JWTService],
})
export class CommonModule {}
