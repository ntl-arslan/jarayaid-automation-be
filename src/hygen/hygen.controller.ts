import { Controller, Get } from '@nestjs/common';
import { HeygenService } from './hygen.service';


@Controller('heygen')
export class HeygenController {
  constructor(private readonly heygenService: HeygenService) {}

  @Get('generate-news')
  async generateNews() {
    return await this.heygenService.generateShortNewsVideo();
  }
}
