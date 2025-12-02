import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteJoiningWordsDto {
 
  @IsString()
 @IsNotEmpty()
  operator?: string;
  
    @IsString()
 @IsNotEmpty()
  status?: string;
}
