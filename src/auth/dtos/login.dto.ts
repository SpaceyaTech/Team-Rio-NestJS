import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ type: 'string', example: 'test@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ type: 'string', example: 'password123' })
  @IsString()
  password: string;
}
