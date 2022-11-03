import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOneBy({ email });
    if (!user) return null;
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) return null;
    return user;
  }

  signup(user: CreateUserDto) {
    user.password = bcrypt.hashSync(user.password, 10);
    return this.usersService.create(user);
  }
}
