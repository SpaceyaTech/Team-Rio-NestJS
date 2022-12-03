import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthConfig } from 'config';
import { Response, Request } from 'express';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Serialize } from '../common/interceptors/serialize.interceptor';
import { FetchUserDto } from '../users/dtos/fetch-user.dto';
import { LoginDto } from './dtos/login.dto';
import { JwtAuthService } from './jwt-auth.service';

@Controller('auth/jwt')
@Serialize(FetchUserDto)
export class JwtAuthController {
  authConfig: AuthConfig;

  constructor(
    private authService: JwtAuthService,
    private configService: ConfigService,
  ) {
    this.authConfig = this.configService.get<AuthConfig>('auth');
  }

  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const loginRes = await this.authService.login(body);
    res.cookie('refreshToken', loginRes.refreshToken, {
      httpOnly: true, // make the refresh token a HttpOnly cookie for security
      maxAge: 1000 * this.authConfig.jwtRefreshExpire, // convert to milliseconds
    });
    return loginRes;
  }

  @Get('refresh-token')
  async refreshToken(@Req() req: Request) {
    return this.authService.refreshToken(req.cookies['refreshToken']);
  }

  @Get('logout')
  async logout(@CurrentUser() user, @Res() res: Response, @Req() req: Request) {
    const { token } = await this.authService.findOne(
      req.cookies['refreshToken'],
    );
    await this.authService.delete(token);
    return res.clearCookie('refreshToken', { httpOnly: true }).send();
  }
}
