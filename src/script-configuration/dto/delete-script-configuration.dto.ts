import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteScriptConfigurationDto {
 
  @IsString()
 @IsNotEmpty()
  operator?: string;
  
    @IsString()
 @IsNotEmpty()
  status?: string;
}
