import {
  IsInt,
  IsOptional,
  IsString,
  IsIn,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCountrySourceDto {
  @IsString()
  news_source: string;

  @IsString()
  source_name: string;

  @IsOptional()
  @IsString()
  source_type?: string;

  @IsOptional()
  @IsString()
  joining_words?: string;       

  @IsOptional()
  @IsString()
  intro_music_path?: string;

  @IsOptional()
  @IsNumber()
  article_count?: number;

  @IsOptional()
  @IsNumber()
  sequence?: number;
}
export class CreateCountriesInfoDto {
  @IsNumber()
  country_id: number;

  @IsString()
  country_name: string;

  @IsString()
  @IsOptional()
  country_arabic_name?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsString()
  @IsIn(['AUTO', 'MANUAL'], { message: 'Type must be either AUTO or MANUAL' })
  type?: string;

  @IsString()
  @IsOptional()
  operator?: string;

  @IsString()
  @IsIn(['ACTIVE', 'INACTIVE'], {
    message: 'Status must be either ACTIVE or INACTIVE',
  })
  status?: string;

  
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCountrySourceDto)
  @IsOptional()
  sources?: CreateCountrySourceDto[];
}
