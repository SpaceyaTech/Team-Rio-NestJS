import { PassportSerializer } from '@nestjs/passport';

export class SessionSerializer extends PassportSerializer {
  serializeUser(user: any, done: Function) {
    return done(null, user);
  }
  deserializeUser(payload: any, done: Function) {
    return done(null, payload);
  }
}
