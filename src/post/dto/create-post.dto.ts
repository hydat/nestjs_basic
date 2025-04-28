import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreatePostDto {
    @IsNotEmpty()
    @IsString()
    title: string;
  
    @IsNotEmpty()
    @IsString()
    content: string;
  
    @IsNotEmpty()
    @IsInt()
    userId: number;
  }