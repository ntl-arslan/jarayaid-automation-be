import { PartialType } from '@nestjs/mapped-types';
import { CreateScriptGenerationDto } from './create-script-generation.dto';

export class UpdateScriptGenerationDto extends PartialType(CreateScriptGenerationDto) {}
