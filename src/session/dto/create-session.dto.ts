import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSessionDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  expiredDate: Date;
}
