import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private config: ConfigService) {
    super();
  }

  validate(req: Request) {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) throw new ForbiddenException('Invalid refresh token');
    return refreshToken;
  }
}
