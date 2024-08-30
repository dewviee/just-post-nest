import { Injectable } from '@nestjs/common';
import { CookieOptions, Response } from 'express';

@Injectable()
export class CookieService {
  defaultOpt: CookieOptions;

  constructor() {
    this.defaultOpt = { httpOnly: true };

    if (process.env.TYPE == 'prod') {
      this.defaultOpt.sameSite = 'lax';
    } else {
      this.defaultOpt.sameSite = 'none';
    }
  }

  set(
    name: string,
    value: string,
    options: CookieOptions,
    res: Response<any, Record<string, any>>,
  ) {
    if (process.env.SECURE_COOKIES === 'true') {
      options.secure = true;
    }

    res.cookie(name, value, { ...this.defaultOpt, ...options });
  }
}
