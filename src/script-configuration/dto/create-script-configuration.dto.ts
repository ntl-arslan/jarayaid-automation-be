import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateScriptConfigurationDto {
 

  @IsNotEmpty()
  @IsString()
  key: string;

  @IsNotEmpty()
  @IsString()
  value: string;

  @IsNotEmpty()
  @IsInt()
  sequence: number;

  @IsNotEmpty()
  @IsString()
  operator: string;
}
