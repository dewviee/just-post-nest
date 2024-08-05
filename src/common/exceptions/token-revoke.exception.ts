import { HttpException, HttpExceptionOptions } from '@nestjs/common';

export class TokenRevokeException extends HttpException {
  constructor(
    message: string = 'Token has been revoke',
    options?: HttpExceptionOptions,
  ) {
    super({ message: message }, 401, options);
  }
}
