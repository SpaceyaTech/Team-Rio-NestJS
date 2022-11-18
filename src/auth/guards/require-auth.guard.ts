import jwt from 'jsonwebtoken';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

export class RequireAuth implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    if (req.isAuthenticated) {
      return req.isAuthenticated();
    }

    let token: any = req.headers['authorization'];

    if (!token) return false;

    token = token.split(' ');

    if (token[0] !== 'Bearer') return false;

    token = token[1];

    try {
      const decodedToken = jwt.verify(token, 'gsjagjddj');
      req.user = decodedToken;
    } catch (err) {
      return false;
    }

    return true;
  }
}
