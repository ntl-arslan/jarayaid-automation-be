import { PartialType } from '@nestjs/mapped-types';
import { CreateUploadSchedulerDto } from './create-upload-scheduler.dto';

export class UpdateUploadSchedulerDto extends PartialType(CreateUploadSchedulerDto) {}
