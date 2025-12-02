import { IsNotEmpty, IsString, IsInt, IsOptional } from 'class-validator';

export class CreateScriptConfigurationDto {
 

  @IsNotEmpty()
  @IsString()
  key: string;

  @IsNotEmpty()
  @IsString()
  value: string;

  @IsOptional()
  @IsInt()
  sequence: number;

  @IsOptional()
  @IsString()
  operator: string;
}
