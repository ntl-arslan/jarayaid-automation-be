import { IsOptional, IsString, IsNumber, IsIn } from 'class-validator';

export class UpdateSourceDto {
  @IsOptional()
  @IsString()
  news_source?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsNumber()
  joining_words?: number;

  @IsOptional()
  @IsString()
  intro_music_path?: string;

  @IsOptional()
  @IsNumber()
  article_count?: number;

  @IsOptional()
  @IsNumber()
  sequence?: number;

  @IsOptional()
  @IsString()
  @IsIn(['ACTIVE', 'INACTIVE'], {
    message: 'Status must be either ACTIVE or INACTIVE',
  })
  status?: string;
}
