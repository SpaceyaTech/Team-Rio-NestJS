import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../../users/users.service';

@Injectable()
export class CreateBlogInterceptor implements NestInterceptor {
  constructor(private usersServive: UsersService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    req.body.author = await this.usersServive.findById(req.body.author);
    // console.log(req.body);
    return next.handle();
  }
}
