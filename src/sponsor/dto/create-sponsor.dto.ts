import { IsString, IsOptional, IsDateString, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { SponsorCountryItemDto } from 'src/sponsor-countries/dto/create-sponsor-country.dto';


export class CreateSponsorDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsDateString()
  startdate?: string;

  @IsOptional()
  @IsDateString()
  enddate?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  operator?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SponsorCountryItemDto)
  countries: SponsorCountryItemDto[];
}
