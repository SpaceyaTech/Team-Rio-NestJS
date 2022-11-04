import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { FetchUserDto } from 'src/users/dtos/fetch-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { LoginGuard } from './guards/login.guard';
import { RequireAuth } from './guards/require-auth.guard';

@ApiTags('Auth')
@Controller('auth')
@Serialize(FetchUserDto)
export class AuthController {
  constructor(private authService: AuthService) {}

  // POST authentication details
  @ApiOperation({
    summary: 'Login a user',
    description:
      'Logs in a user to our application using their email and password\
       using cookie session',
  })
  @Post('login')
  @UseGuards(LoginGuard)
  login(@Request() req, @Body() body: LoginDto) {
    return req.user;
  }

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

  // GET a user's profile details
  @ApiOperation({
    summary: "Get a user's profile",
    description: 'Fetches user profile details',
  })
  @Get('profile')
  @UseGuards(RequireAuth)
  profile(@CurrentUser() user) {
    return user;
  }

  // GET logout a user
  @ApiOperation({
    summary: 'Logout a user',
    description:
      'Logs out a user from the application. This deletes a user cookie',
  })
  @Get('logout')
  @UseGuards(RequireAuth)
  logout(@Request() req) {
    return req.logout(() => null);
  }
}
