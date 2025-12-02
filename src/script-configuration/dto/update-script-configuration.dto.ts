import { PartialType } from '@nestjs/mapped-types';
import { CreateScriptConfigurationDto } from './create-script-configuration.dto';

export class UpdateScriptConfigurationDto extends PartialType(CreateScriptConfigurationDto) {}
