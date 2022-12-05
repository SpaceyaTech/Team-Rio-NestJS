import {
  ArgumentsHost,
  Catch,
  ExceptionFilter as NestExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class ExceptionFilter implements NestExceptionFilter {
  private readonly logger = new Logger(ExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const req = context.getRequest();
    const res = context.getResponse();

    if (!(exception instanceof Error)) {
      exception = new Error(exception);
    }

    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception.getResponse
      ? exception.getResponse()
      : exception.message;

    this.logger.error(exception, {
      name: exception.name,
      message: message,
      status: status,
      path: req.url,
      stack: exception.stack,
    });

    res.status(status).json({
      statusCode: status,
      message: message,
      path: req.url,
      timestamp: new Date().toISOString(),
    });
  }
}
