import { Body, Controller, Post, Request, Response } from '@nestjs/common';
import { Request as RequestEx, Response as ResponseEx } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { JWTService } from 'src/common/services/jwt.service';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JWTService,
  ) {}

  @Public()
  @Post('/register')
  async register(@Body() body: RegisterDTO) {
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
}
