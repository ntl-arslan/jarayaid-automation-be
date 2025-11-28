import { IsInt, IsOptional, IsString } from 'class-validator';

export class SponsorCountryItemDto {
  @IsInt()
  country_id: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  operator?: string;
}
