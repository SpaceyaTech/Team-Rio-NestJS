import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import config, { AuthConfig } from 'config';

const jwt = require('jsonwebtoken');

export class RequireAuth implements CanActivate {
  authConfig = config().auth;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request = context.switchToHttp().getRequest();

    if (req.isAuthenticated()) {
      return true;
    }

    let token: any = req.headers['authorization'];

    if (!token) return false;

    token = token.split(' ');

    if (token[0] !== 'Bearer') return false;

    token = token[1];

    try {
      const decodedToken = jwt.verify(token, this.authConfig.jwtSecret);
      req.user = decodedToken;
    } catch (err) {
      throw new ForbiddenException('Access token has expired');
    }

    return true;
  }
}
