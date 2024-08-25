import {
  Body,
  Controller,
  Param,
  Post,
  Request,
  Response,
} from '@nestjs/common';
import { Request as RequestEx, Response as ResponseEx } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { UserEntity } from 'src/common/entities/post/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import {
  PasswordResetDto,
  RequestPasswordResetDto,
} from './dto/password-reset.dto';
import { RevokeTokenDTO } from './dto/revoke.dto';
import { SessionService } from './session.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
  ) {}

  @Public()
  @Post('/register')
  async register(@Body() body: CreateUserDto) {
    return await this.authService.register(body);
  }

  @Public()
  @Post('/login')
  async login(@Body() body: LoginDTO, @Response() response: ResponseEx) {
    const accessToken = await this.authService.login(body, response);
    response.status(200).json({
      accessToken: accessToken,
    });
  }

  @Public()
  @Post('/forget-password')
  async forgetPassword(@Body() body: RequestPasswordResetDto) {
    await this.authService.requestResetPassword(body);
  }

  @Public()
  @Post('/reset-password')
  async resetPassword(@Body() body: PasswordResetDto) {
    return await this.authService.passwordReset(body);
  }

  @Public()
  @Post('/refresh-access-token')
  async refreshToken(@Request() request: RequestEx) {
    return await this.authService.refreshToken(request);
  }

  @Public()
  @Post('/refresh/refresh-token')
  async refreshRefreshToken(
    @Request() request: RequestEx,
    @Response() response: ResponseEx,
  ) {
    await this.authService.refreshRefreshToken(request, response);
    response.status(200).json();
  }

  @Post('/revoke/refresh-token')
  async revokeRefreshToken(@Request() req: RequestEx) {
    await this.authService.revokeRefreshToken(req);
  }

  @Post('/revoke/refresh-token/:id')
  async revokeRefreshTokenByID(
    @Param() body: RevokeTokenDTO,
    @User() user: UserEntity,
  ) {
    return await this.sessionService.revokeRefreshTokenByID(body.id, user);
  }

  @Post('/revoke/all')
  async revokeAllRefreshToken(@User() user: UserEntity) {
    await this.sessionService.revokeAllToken(user);
  }

  @Post('/logout')
  async logout(
    @Request() request: RequestEx,
    @Response() response: ResponseEx,
  ) {
    await this.authService.logout(request, response);
  }
}
