import {
  Body,
  Controller,
  Get,
  Post,
  Request as NestRequest,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Serialize } from '../interceptors/serialize.interceptor';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { FetchUserDto } from '../users/dtos/fetch-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { LoginGuard } from './guards/login.guard';
import { RequireAuth } from './guards/require-auth.guard';

@ApiTags('Auth')
@Controller('auth')
@Serialize(FetchUserDto)
export class AuthController {
  constructor(private authService: AuthService) {}

  // POST a new user
  @ApiOperation({
    summary: 'Sugnup user',
    description:
      'Creates a new user account. Checks if a user with that email exists',
  })
  @Post('signup')
  signup(@Body() body: CreateUserDto) {
    return this.authService.signup(body);
  }

  // POST authentication details
  @ApiOperation({
    summary: 'Login a user',
    description:
      'Logs in a user to our application using their email and password\
       using cookie session',
  })
  @Post('login')
  @UseGuards(LoginGuard)
  login(@NestRequest() req, @Body() body: LoginDto) {
    return req.user;
  }

  // GET a user's profile details
  @ApiOperation({
    summary: "Get a user's profile",
    description: 'Fetches user profile details',
  })
  @Get('profile')
  @UseGuards(RequireAuth)
  async profile(@CurrentUser() user) {
    return this.authService.getCurrentUser(user);
  }

  // GET logout a user
  @ApiOperation({
    summary: 'Logout a user',
    description:
      'Logs out a user from the application. This deletes a user cookie',
  })
  @Get('logout')
  @UseGuards(RequireAuth)
  logout(@NestRequest() req) {
    return req.logout(() => null);
  }
}
