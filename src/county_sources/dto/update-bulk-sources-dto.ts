import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class JarayidItemDto {
  @IsNotEmpty()
  id: string;

  @IsOptional()
  @IsNumber()
  article_count?: number;

  @IsOptional()
  @IsNumber()
  sequence?: number;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  operator: string;

  @IsOptional()
  joining_words?: string;

  @IsOptional()
  intro_music_path?: string;

  @IsNotEmpty()
  jarayid_source_id: string;

  @IsNotEmpty()
  source: string;

  @IsNotEmpty()
  news_source: string;

  @IsNotEmpty()
  jarayid_country_id: string;
}

export class UpdateBulkSourceDto {
  @IsNotEmpty()
  items: JarayidItemDto[];
}
