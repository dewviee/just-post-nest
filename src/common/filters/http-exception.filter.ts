import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import dayjs from 'dayjs';
import { Request, Response } from 'express';
import { CustomErrorException } from '../exceptions/custom-error.exception';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new Logger('HttpExceptionFilter');
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.response?.message || exception.message;
    const errorMessage = `${JSON.stringify(message)} At: ${
      exception.stack.split('at ')[1]
    }`;

    this.logger.error(errorMessage);

    let resPayload: object = {
      message: message,
      path: request.url,
      timestamp: dayjs().toDate().toISOString(),
    };

    if (exception instanceof CustomErrorException) {
      resPayload = { ...resPayload, errorCode: exception.errorCode };
    }
    response.status(status).json(resPayload);
  }
}
