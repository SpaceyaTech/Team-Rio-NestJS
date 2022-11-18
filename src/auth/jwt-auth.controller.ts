import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthConfig } from 'config';
import { Response, Request } from 'express';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { FetchUserDto } from 'src/users/dtos/fetch-user.dto';
import { LoginDto } from './dtos/login.dto';
import { RequireAuth } from './guards/require-auth.guard';
import { TokensService } from './tokens.service';

@Controller('auth/jwt')
@Serialize(FetchUserDto)
export class JwtAuthController {
  authConfig: AuthConfig;

  constructor(
    private tokensService: TokensService,
    private configService: ConfigService,
  ) {
    this.authConfig = this.configService.get<AuthConfig>('auth');
  }

  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const loginRes = await this.tokensService.login(body);
    res.cookie('refreshToken', loginRes.refreshToken, {
      httpOnly: true, // make the refresh token a HttpOnly cookie for security
      maxAge: 1000 * this.authConfig.jwtRefreshExpire, // convert to milliseconds
    });
    return loginRes;
  }

  @Get('refresh-token')
  async refreshToken(@Req() req: Request) {
    return this.tokensService.refreshToken(req.cookies['refreshToken']);
  }

  @Get('logout')
  @UseGuards(RequireAuth)
  async logout(@CurrentUser() user, @Res() res: Response) {
    const { token } = await this.tokensService.findByUser(user.id);
    await this.tokensService.delete(token);
    return res.clearCookie('refreshToken', { httpOnly: true }).send();
  }
}
