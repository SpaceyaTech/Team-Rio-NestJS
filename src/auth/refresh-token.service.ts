import { v4 as uuid4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { RefreshToken } from './refresh-token.entity';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(RefreshToken)
    private tokensRepository: Repository<RefreshToken>,
    private usersService: UsersService,
  ) {}

  async createToken(userId: string) {
    const existingUserToken = await this.tokensRepository.findOneBy({
      user: { id: userId },
    });

    if (existingUserToken) {
      return existingUserToken.token;
    }

    let _expires = new Date();
    // TODO: Set the expiration as a config variable
    _expires.setSeconds(_expires.getSeconds() + 60 * 60 * 24 * 1); // expires in one day

    const token = this.tokensRepository.create({
      token: uuid4(),
      user: { id: userId },
      expires: _expires,
    });

    const newToken = await this.tokensRepository.save(token);

    return newToken.token;
  }

  validateToken(token: RefreshToken) {
    return token.expires.getTime() > new Date().getTime();
  }
}
