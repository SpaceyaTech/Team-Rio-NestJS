import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Hello World')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: 'Get Hello Wolrd',
    description:
      'Returns the string "Hello World!" can be used for testing purposes',
  })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
