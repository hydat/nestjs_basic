import {
  IsString,
  IsEmail,
  MinLength,
  IsOptional,
  IsNotEmpty,
  Length,
} from 'class-validator';
import { Match } from 'src/common/decorators/match.decorator';

export class CreateUserDto {
  @IsString({ message: 'string cho.' })
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @Match('password', {
    message: 'Mật khẩu không khớp',
  })
  confirmPassword: string;
}
