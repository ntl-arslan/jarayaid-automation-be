import { IsInt, IsOptional, IsString, IsDate, IsIn, IsNumber } from 'class-validator';

export class CreateCountriesInfoDto {
 
	  @IsNumber()
  country_id: number;
	
	@IsString()
	country_name: string;


	@IsString()
	country_arabic_name?: string;

	@IsOptional()
	@IsString()
	slug?: string;


	@IsString()
	@IsIn(['AUTO', 'MANUAL'], { message: 'Type must be either AUTO or MANUAL' })
	type?: string;


	@IsString()
	operator?: string;

		@IsString()
			@IsIn(['ACTIVE', 'INACTIVE'], { message: 'Status must be either ACTIVE or INACTIVE' })
	status?: string;

}
