import { Controller, Post, Body } from '@nestjs/common';
import { OpenAIService } from './open-ai.service';
import { GenerateScriptDto } from './dto/generate-script-dto';

@Controller('open-ai')
export class OpenAIController {
  constructor(private readonly openaiService: OpenAIService) {}

  @Post('generate')
  async generateNewsScripts(@Body() generateScriptDto: GenerateScriptDto,) {
    const { operator } = generateScriptDto;
    return this.openaiService.generateScripts(operator);
  }
}
