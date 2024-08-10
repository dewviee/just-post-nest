import {
  HttpException,
  HttpExceptionOptions,
  HttpStatus,
} from '@nestjs/common';
import { EErrorCode } from '../enum/auth.enum';

/**
 * @param response string, object describing the error condition or the error cause.
 * @param httpStatus HttpStatus enum or status number to describe Http Status
 * @param options.httpOptions HttpExceptionOptions
 * @param options.errorCode EErrorCode describe error code for some service
 */
export class CustomErrorException extends HttpException {
  readonly errorCode: EErrorCode;
  constructor(
    response: string | Record<string, any>,
    httpStatus: HttpStatus | number,
    options?: {
      httpOptions?: HttpExceptionOptions;
      errorCode?: EErrorCode;
    },
  ) {
    super(response, httpStatus, options.httpOptions ?? {});
    this.errorCode = options?.errorCode;
  }
}
