import { Body, Controller, Post } from '@nestjs/common';
import { HeygenService } from './hygen.service';


@Controller('heygen')
export class HeygenController {
  constructor(private readonly heygenService: HeygenService) {}

  @Post('generate-news')
  // async generateNews() {
  //   return await this.heygenService.generateShortNewsVideo();
  // }
  // @Get('generate-news')
  async generateNews(@Body() { country_id }: { country_id?: string }) {
    const id = country_id ? parseInt(country_id, 10) : undefined;
    return await this.heygenService.generateShortNewsVideo(id);
  }
}
