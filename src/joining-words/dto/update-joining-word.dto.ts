import { PartialType } from '@nestjs/mapped-types';
import { CreateJoiningWordDto } from './create-joining-word.dto';

export class UpdateJoiningWordDto extends PartialType(CreateJoiningWordDto) {}
