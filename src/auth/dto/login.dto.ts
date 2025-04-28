import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class LoginResponse {
  @IsNotEmpty()
  @IsString()
  user: User;

  @IsNotEmpty()
  @IsString()
  accessToken: string;

  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
