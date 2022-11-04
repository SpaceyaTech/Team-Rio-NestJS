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

  async validatePassword(password: string, userId: string): Promise<boolean> {
    const user = await this.usersService.findById(userId);
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) return false;
    return true;
  }

  async changePassword(userId: string, newPassword: string) {
    const password = bcrypt.hashSync(newPassword, 10);
    return this.usersService.update(userId, { password });
  }
}
