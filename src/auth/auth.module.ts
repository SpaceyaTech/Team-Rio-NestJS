import { Module } from '@nestjs/common';
import { RolesModule } from 'src/roles/roles.module';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionSerializer } from './passport/session.serializer';
import { LocalStrategy } from './passport/strategies/local.strategy';

@Module({
  imports: [UsersModule, RolesModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, SessionSerializer],
})
export class AuthModule {}
