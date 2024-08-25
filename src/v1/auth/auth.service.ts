import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { Request, Response } from 'express';
import { RefreshTokenEntity } from 'src/common/entities/post/session-refresh-token.entity';
import { UserPasswordResetEntity } from 'src/common/entities/post/user-password-reset.entity';
import { UserEntity } from 'src/common/entities/post/user.entity';
import { EAuthErrCode, EResetPwdErrCode } from 'src/common/enum/auth.enum';
import { CustomErrorException } from 'src/common/exceptions/custom-error.exception';
import { JWTService } from 'src/common/services/jwt.service';
import { EntityManager, Equal, Repository } from 'typeorm';
import { PasswordService } from '../../common/services/password.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { LoginDTO } from './dto/login.dto';
import {
  PasswordResetDto,
  RequestPasswordResetDto,
} from './dto/password-reset.dto';
import { ForgetPasswordService } from './forget-password.service';
import { IAuthTokenInfo } from './interfaces/token.interface';
import { SessionService } from './session.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    @InjectRepository(UserPasswordResetEntity)
    private readonly userPassResetRepo: Repository<UserPasswordResetEntity>,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JWTService,
    private readonly sessionService: SessionService,
    private readonly tokenService: TokenService,
    private readonly forgetPasswordService: ForgetPasswordService,
    private readonly userService: UserService,
  ) {}

  async register(body: CreateUserDto) {
    const [hashedPassword, users] = await Promise.all([
      this.passwordService.hash(body.password, 10),
      this.userService.findConflictingUserInfo(body),
    ]);

    if (users.length > 0) {
      const errorFields: string[] = [];
      if (users.find((user) => user.username === body.username))
        errorFields.push(`'${body.username}' `);
      if (users.find((user) => user.email === body.email))
        errorFields.push(`'${body.email}'`);

      throw new BadRequestException(
        `[${errorFields.join(', ')}] already exist`,
      );
    }

    body.password = hashedPassword;

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
      this.tokenService.generateAccessToken(payload),
      this.tokenService.generateRefreshToken(payload),
    ]);

    await this.sessionService.login(accessToken, refreshToken, user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      expires: dayjs().add(7, 'day').toDate(),
    });

    return accessToken;
  }

  async requestResetPassword(body: RequestPasswordResetDto) {
    const user = await this.userRepo.findOneBy({ email: Equal(body.email) });
    if (!user) {
      throw new NotFoundException('user not found');
    }

    await this.forgetPasswordService.requestResetPassword(body.email, user);
  }

  async passwordReset(body: PasswordResetDto) {
    const tokenInfo = await this.userPassResetRepo.findOne({
      select: {
        user: {
          id: true,
        },
      },
      where: { token: Equal(body.token) },
      relations: { user: true },
    });

    if (!tokenInfo) {
      throw new CustomErrorException(
        'reset password token not found',
        HttpStatus.BAD_REQUEST,
        { errorCode: EResetPwdErrCode.TOKEN_NOT_FOUND },
      );
    }

    if (tokenInfo.isUse) {
      throw new CustomErrorException(
        'reset password token already used',
        HttpStatus.BAD_REQUEST,
        { errorCode: EResetPwdErrCode.TOKEN_USED },
      );
    }

    if (dayjs().isAfter(tokenInfo.expiredAt)) {
      throw new CustomErrorException(
        'reset password token already expired',
        HttpStatus.BAD_REQUEST,
        { errorCode: EResetPwdErrCode.TOKEN_EXPIRED },
      );
    }

    const hashedPassword = await this.passwordService.hash(body.password);
    await this.entityManager.transaction(async (manager: EntityManager) => {
      tokenInfo.isUse = true;
      await manager.save(tokenInfo);

      await manager.update(
        UserPasswordResetEntity,
        { isUse: false, user: tokenInfo.user },
        { expiredAt: dayjs().toDate() },
      );

      await manager.update(
        UserEntity,
        { id: tokenInfo.user.id },
        { password: hashedPassword },
      );
    });
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

    const [accessToken, rfTokenEnt] = await Promise.all([
      this.tokenService.generateAccessToken(data.payload),
      this.tokenService.findRefreshTokenFromToken(refreshToken),
    ]);

    await this.sessionService.createAccessTokenSession(rfTokenEnt, accessToken);
    return { token: accessToken };
  }

  async refreshRefreshToken(req: Request, res: Response) {
    const oldRefreshToken: string = req.cookies.refreshToken;

    const refreshToken = await this.entityManager.findOne(RefreshTokenEntity, {
      where: {
        token: Equal(oldRefreshToken),
      },
      relations: {
        user: true,
      },
    });

    if (!refreshToken) {
      throw new CustomErrorException('token revoked', HttpStatus.UNAUTHORIZED, {
        errorCode: EAuthErrCode.REFRESH_TOKEN_REVOKE,
      });
    }

    if (dayjs(refreshToken.expiredAt).isBefore(dayjs())) {
      throw new CustomErrorException('token expired', HttpStatus.UNAUTHORIZED, {
        errorCode: EAuthErrCode.REFRESH_TOKEN_EXPIRED,
      });
    }

    const payload = { username: refreshToken.user.username };

    const newRefreshToken =
      await this.tokenService.generateRefreshToken(payload);

    await this.sessionService.createRefreshTokenSession(
      refreshToken.user,
      newRefreshToken,
    );

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      expires: dayjs().add(7, 'day').toDate(),
    });
  }

  async revokeRefreshToken(req: Request) {
    const refreshTokenString: string = req.cookies.refreshToken;

    await this.sessionService.revokeRefreshToken(refreshTokenString);
  }

  async logout(request: Request, response: Response) {
    await this.revokeRefreshToken(request);

    response.cookie('refreshToken', '', {
      httpOnly: true,
      expires: dayjs(0).toDate(),
    });

    response.status(HttpStatus.OK).json();
  }
}
