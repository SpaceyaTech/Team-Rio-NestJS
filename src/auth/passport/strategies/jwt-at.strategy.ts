import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RoleDto } from '../../../roles/role.dto';

export type JwtPayload = {
  id: string;
  email: string;
  role: RoleDto;
};

@Injectable()
export class JwtAtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('auth.jwt.secret'),
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}
