import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteUploadSchedulerDto {
 
  @IsString()
 @IsNotEmpty()
  operator?: string;
  
    @IsString()
 @IsNotEmpty()
  status?: string;
}
