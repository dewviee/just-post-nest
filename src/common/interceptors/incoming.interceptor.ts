import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class IncomingInterceptor implements NestInterceptor {
  private logger = new Logger('IncomingRequest');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();

    this.logIncomingRequest(request);
    return next.handle();
  }

  private logIncomingRequest(request: Request) {
    const requestPathInfo = `${request.method} ${request.path}`;
    const formattedRequestBody = this.extractRequestDetails(request);

    if (formattedRequestBody.length > 2) {
      this.logger.log(requestPathInfo, formattedRequestBody);
      return;
    }
    this.logger.log(requestPathInfo);
  }

  private extractRequestDetails(request: Request): string {
    return JSON.stringify({
      body: Object.keys(request.body).length ? request.body : undefined,
      query: Object.keys(request.query).length ? request.query : undefined,
      params: Object.keys(request.params).length ? request.params : undefined,
    });
  }
}
