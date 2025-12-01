import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateScriptGenerationDto {

    @IsString()
  @IsIn(['APPROVED', 'REJECTED'], {
    message: 'Status must be either APPROVED or REJECTED',
  })
  approval_status?: string;

  @IsOptional()
  @IsString()
  operator?: string;

  @IsOptional()
  @IsString()
  cancellation_remarks?: string;
}
