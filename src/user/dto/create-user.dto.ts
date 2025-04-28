import {
  IsString,
  IsEmail,
  MinLength,
  IsOptional,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { Match } from 'src/common/decorators/match.decorator';
import { ERoles } from 'src/common/enum/role.enum';

export class CreateUserDto {
  @IsString({ message: 'Username must be a string.' })
  username: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsEnum(ERoles)
  role: ERoles;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @Match('password', {
    message: 'Confirm password not match.',
  })
  confirmPassword: string;
}
