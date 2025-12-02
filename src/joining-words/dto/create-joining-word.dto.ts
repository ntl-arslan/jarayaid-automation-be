import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateJoiningWordDto {
  @IsString()
  @IsNotEmpty()
  joining_word: string;

  @IsString()
 @IsNotEmpty()
  operator?: string;
}
