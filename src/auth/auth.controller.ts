import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { FetchUserDto } from 'src/users/dtos/fetch-user.dto';
import { AuthService } from './auth.service';
import { LoginGuard } from './guards/login.guard';
import { RequireAuth } from './guards/require-auth.guard';

@Controller('auth')
@ApiTags('Auth')
@Serialize(FetchUserDto)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LoginGuard)
  login(@Request() req) {
    return req.user;
  }

  @Post('signup')
  signup(@Body() body: CreateUserDto) {
    return this.authService.signup(body);
  }

  @Get('profile')
  @UseGuards(RequireAuth)
  profile(@CurrentUser() user) {
    return user;
  }

  @Get('logout')
  @UseGuards(RequireAuth)
  logout(@Request() req) {
    return req.logout(() => null);
  }
}
