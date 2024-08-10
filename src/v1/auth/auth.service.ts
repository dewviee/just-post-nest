import {
  BadRequestException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { Request, Response } from 'express';
import { UserEntity } from 'src/common/entities/post/user.entity';
import { EAuthErrCode } from 'src/common/enum/auth.enum';
import { CustomErrorException } from 'src/common/exceptions/custom-error.exception';
import { JWTService } from 'src/common/services/jwt.service';
import { EntityManager, Repository } from 'typeorm';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { IAuthTokenInfo } from './interfaces/token.interface';
import { PasswordService } from './password.service';
import { SessionService } from './session.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JWTService,
    private readonly sessionService: SessionService,
  ) {}

  async register(body: RegisterDTO) {
    body.password = await this.passwordService.hash(body.password, 10);

    const user = this.userRepo.create({
      ...body,
    });

    return await this.userRepo.save(user);
  }

  async login(body: LoginDTO, res: Response) {
    const user = await this.userRepo.findOne({
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
        refreshToken: true,
      },
      relations: { refreshToken: true },
      where: [{ email: body.identifier }, { username: body.identifier }],
    });

    if (!user) {
      throw new BadRequestException('User not exist or password not match');
    }

    const isPasswordMatch = await this.passwordService.compare(
      body.password,
      user.password,
    );
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Password not match! Please try again.');
    }

    const payload = { username: user.username };

    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload),
    ]);

    await this.sessionService.login(accessToken, refreshToken, user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      expires: dayjs().add(7, 'day').toDate(),
    });

    return accessToken;
  }

  async refreshToken(req: Request) {
    const refreshToken: string = req.cookies.refreshToken;
    const data: IAuthTokenInfo = await this.jwtService.decode(refreshToken, {
      jwtVerifyOptions: { secret: process.env.JWT_SECRET_REFRESH },
    });

    if (await this.sessionService.isRefreshTokenRevoke(refreshToken)) {
      throw new CustomErrorException(
        'token has been revoked',
        HttpStatus.UNAUTHORIZED,
        { errorCode: EAuthErrCode.REFRESH_TOKEN_REVOKE },
      );
    }

    const accessToken = await this.generateAccessToken(data.payload);
    return { token: accessToken };
  }

  private async generateAccessToken(payload: object) {
    return await this.jwtService.sign(
      { ...payload, type: 'access' },
      {
        expiresIn: '30m',
        secret: process.env.JWT_SECRET_ACCESS,
      },
    );
  }

  private async generateRefreshToken(payload: object) {
    return await this.jwtService.sign(
      { payload, type: 'refresh' },
      {
        expiresIn: '7d',
        secret: process.env.JWT_SECRET_REFRESH,
      },
    );
  }
}
