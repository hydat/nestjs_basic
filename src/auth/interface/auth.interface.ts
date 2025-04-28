import { IsNotEmpty, IsNumber } from 'class-validator';

export class AuthResponse {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  role: number;

  @IsNotEmpty()
  @IsNumber()
  sessionId: number;
}

export interface IAuthResponse {
  userId: number;
  sessionId: number;
  role: number;
}
