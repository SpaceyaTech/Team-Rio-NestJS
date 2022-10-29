import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';

export class EditUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  avatar: string;
}
