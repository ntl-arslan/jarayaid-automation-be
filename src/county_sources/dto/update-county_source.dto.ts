import { PartialType } from '@nestjs/mapped-types';
import { CreateCountriesInfoDto } from './create-county_source.dto';


export class UpdateCountriesInfoDto extends PartialType(CreateCountriesInfoDto) {}
