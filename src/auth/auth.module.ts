import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from '../roles/roles.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthController } from './jwt-auth.controller';
import { SessionSerializer } from './passport/session.serializer';
import { LocalStrategy } from './passport/strategies/local.strategy';
import { RefreshToken } from './refresh-token.entity';
import { TokensService } from './tokens.service';

@Module({
  exports: [AuthService],
  imports: [TypeOrmModule.forFeature([RefreshToken]), UsersModule, RolesModule],
  controllers: [AuthController, JwtAuthController],
  providers: [AuthService, LocalStrategy, SessionSerializer, TokensService],
})
export class AuthModule {}
