import { IsString } from "class-validator";

export class GenerateScriptDto {
  @IsString()
  operator: string;
}
