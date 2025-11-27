import { IsInt, IsOptional, IsString, IsDate } from 'class-validator';

export class CreateCountriesInfoDto {
 
  @IsString()
  country_name: string;

  @IsOptional()
  @IsString()
  country_arabic_name?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  operator?: string;

}
