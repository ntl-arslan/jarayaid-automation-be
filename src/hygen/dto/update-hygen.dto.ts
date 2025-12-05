import { PartialType } from '@nestjs/mapped-types';
import { CreateHygenDto } from './create-hygen.dto';

export class UpdateHygenDto extends PartialType(CreateHygenDto) {}
