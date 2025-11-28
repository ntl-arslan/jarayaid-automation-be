import { Type } from 'class-transformer';
import { ValidateNested, IsArray } from 'class-validator';
import { UploadSchedulerItemDto } from './upload-scheduler-items.dto';


export class CreateUploadSchedulerDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UploadSchedulerItemDto)
  schedulers: UploadSchedulerItemDto[];
}
