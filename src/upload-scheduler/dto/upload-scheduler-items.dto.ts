import { IsInt, IsOptional, IsString } from 'class-validator';

export class UploadSchedulerItemDto {
  @IsInt()
  country_id: number;

  @IsString()
  key: string;

  @IsOptional()
  @IsString()
  value?: string;

  @IsOptional()
  @IsString()
  platform?: string;

  @IsOptional()
  @IsString()
  operator?: string;
}
