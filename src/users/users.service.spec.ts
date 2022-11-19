import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

it('Can create an instance of users service', async () => {
  let service: UsersService;

  const module: TestingModule = await Test.createTestingModule({
    providers: [UsersService],
  }).compile();

  service = module.get<UsersService>(UsersService);

  expect(service).toBeDefined();
});
