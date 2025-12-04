import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class ShcdulerItemsDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

@IsNotEmpty()
  @IsNumber()
  country_id?: number;

  @IsNotEmpty()
  platform: string;

  @IsNotEmpty()
  key: string;

  @IsOptional()
  value?: string;

  @IsNotEmpty()
  operator?: string;
}

export class UpdateBulkSchedulerDto {
  @IsNotEmpty()
  items: ShcdulerItemsDto[];
}
