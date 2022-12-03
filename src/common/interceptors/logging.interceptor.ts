import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';
import { v4 as uuid4 } from 'uuid';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // log requests
    const req = context.switchToHttp().getRequest();
    const userAgent = req.get('user-agent') || '';
    const { ip, method, path } = req;
    const correlationKey = uuid4(); // userd to identify a request to a response
    const userId = req.user?.id;

    this.logger.log(
      `[${correlationKey}] ${method} ${path} ${userId} ${userAgent} ${ip}: ${
        context.getClass().name
      } ${context.getHandler().name}`,
    );

    // log response
    const now = Date.now(); // gate the time before the response was sent back;
    return next.handle().pipe(
      tap(() => {
        const res = context.switchToHttp().getResponse();
        const contentLength = res.get('content-length');

        this.logger.log(
          `[${correlationKey}] ${method} ${path} ${
            res.statusCode
          } ${contentLength}: ${
            Date.now() - now // calculate the time taken for the response
          }ms`,
        );
      }),
    );
  }
}
