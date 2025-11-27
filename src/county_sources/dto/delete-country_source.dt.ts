import {  IsString } from 'class-validator';

export class DeleteCountryInfoDto {

  @IsString()
  operator?: string;

}
