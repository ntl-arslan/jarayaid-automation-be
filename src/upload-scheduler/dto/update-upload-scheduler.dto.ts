import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateUploadSchedulerDto {
 
  @IsString()
   @IsOptional()
  key: string;

  @IsOptional()
  @IsString()
  value?: string;
  
   @IsOptional()
  @IsString()
  platform?: string;

  @IsString()
  operator?: string;
  
   @IsOptional()
  @IsString()
  status?: string; 
}
