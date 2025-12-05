import { Controller, Post, Body } from '@nestjs/common';
import { OpenAIService } from './open-ai.service';

@Controller('open-ai')
export class OpenAIController {
  constructor(private readonly openaiService: OpenAIService) {}

  @Post('generate')
  async generateNewsScript(@Body() body: { headline: string; context?: string }) {
    const { headline, context } = body;

    const prompt = `Write a professional news script based on the headline: "${headline}". 
    ${context ? `Include this context: ${context}` : ''}`;

    const script = await this.openaiService.generateScript(prompt);
    return { script };
  }
}
