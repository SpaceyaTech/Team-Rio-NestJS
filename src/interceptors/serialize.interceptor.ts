import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';

export interface ClassInterface {
  new (...args: any[]): {};
}

export const Serialize = (dto: ClassInterface) => {
  return UseInterceptors(new SerializeInterceptor(dto));
};

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassInterface) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: any) => {
        return plainToInstance(this.dto, data, {
          strategy: 'excludeAll',
          excludeExtraneousValues: true, // removes values not tagged with Expose decorator
          enableImplicitConversion: true, // enables us to use custom types
          exposeUnsetFields: false, // remove undefined fields
        });
      }),
    );
  }
}
