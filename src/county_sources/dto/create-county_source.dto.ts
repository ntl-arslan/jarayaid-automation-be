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
	
		@IsNumber()
	jarayid_country_id: string;

		@IsNumber()
	jarayid_source_id: string;
	
	@IsString()
	@IsOptional()
	news_source: string;

	@IsString()
	@IsOptional()
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

		@IsString()
	@IsOptional()
	operator?: string;
}
export class CreateCountriesInfoDto {
	@IsNumber()
	country_id: number;



	@IsString()
	@IsIn(['AUTO', 'MANUAL'], { message: 'Type must be either AUTO or MANUAL' })
	type?: string;

	@IsString()
	@IsOptional()
	operator?: string;


	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateCountrySourceDto)
	@IsOptional()
	sources?: CreateCountrySourceDto[];
}
