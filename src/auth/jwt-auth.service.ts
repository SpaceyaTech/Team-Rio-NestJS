import { v4 as uuid4 } from 'uuid';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { RefreshToken } from './refresh-token.entity';
import { LoginDto } from './dtos/login.dto';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { AuthConfig } from '../../config';
import { Role } from '../roles/role.entity';
const jwt = require('jsonwebtoken');

interface JwtPayload {
  id: string;
  roles: Role[];
}

@Injectable()
export class JwtAuthService {
  private authConfig: AuthConfig;

  constructor(
    @InjectRepository(RefreshToken)
    private tokensRepository: Repository<RefreshToken>,
    private usersService: UsersService,
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    this.authConfig = this.configService.get<AuthConfig>('auth');
  }

  async login(credentials: LoginDto) {
    const user = await this.usersService.findOneBy({
      email: credentials.email,
    });
    if (!user) {
      throw new BadRequestException('Invalid email/password');
    }
    const passwordIsValid = await this.authService.validatePassword(
      credentials.password,
      user,
    );
    if (!passwordIsValid) {
      throw new BadRequestException('Invalid email/password');
    }
    const payload: JwtPayload = { id: user.id, roles: user.roles };
    const accessToken = jwt.sign(payload, this.authConfig.jwt.secret, {
      expiresIn: this.authConfig.jwt.atExpires, // expire after 30 seconds
    });
    const refreshToken = await this.createToken(user.id);
    return { ...user, accessToken, refreshToken };
  }

  async refreshToken(token: string) {
    if (!token) throw new UnauthorizedException('You are not logged in');
    const refreshToken = await this.findOne(token);
    //hjaghaG
    const tokenIsValid = this.verifyTokenExpiration(refreshToken);
    if (!tokenIsValid) {
      await this.delete(refreshToken.token);
      throw new UnauthorizedException(
        'Refresh token is expired, please login again',
      );
    }
    const payload: JwtPayload = {
      id: refreshToken.user.id,
      roles: refreshToken.user.roles,
    };
    const accessToken = jwt.sign(payload, this.authConfig.jwt.secret, {
      expiresIn: this.authConfig.jwt.atExpires, // expire after 30 seconds
    });
    return { accessToken };
  }

  async findOne(token: string) {
    const refreshToken = await this.tokensRepository.findOne({
      where: { token },
      relations: { user: { roles: true } },
    });
    if (!refreshToken) throw new BadRequestException('Invalid token');
    return refreshToken;
  }

  async findByUser(userId: string) {
    return this.tokensRepository.findOneBy({ user: { id: userId } });
  }

  async createToken(userId: string) {
    const existingUserToken = await this.tokensRepository.findOneBy({
      user: { id: userId },
    });

    if (existingUserToken) {
      return existingUserToken.token;
    }

    let _expires = new Date();
    _expires.setSeconds(_expires.getSeconds() + this.authConfig.jwt.rtExpires);

    const token = this.tokensRepository.create({
      token: uuid4(),
      user: { id: userId },
      expires: _expires,
    });

    const newToken = await this.tokensRepository.save(token);

    return newToken.token;
  }

  delete(token: string) {
    return this.tokensRepository.delete({ token });
  }

  verifyTokenExpiration(token: RefreshToken) {
    return token.expires.getTime() > new Date().getTime();
  }
}
