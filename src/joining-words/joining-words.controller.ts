import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { JoiningWordsService } from './joining-words.service';
import { CreateJoiningWordDto } from './dto/create-joining-word.dto';
import { UpdateJoiningWordDto } from './dto/update-joining-word.dto';


@Controller('joining-words')
export class JoiningWordsController {
  constructor(private readonly joiningWordsService: JoiningWordsService) {}

  @Post()
  create(@Body() createJoiningWordDto: CreateJoiningWordDto) {
    return this.joiningWordsService.createJoiningWords(createJoiningWordDto);
  }
  @Get('active')
getAllActive() {
  return this.joiningWordsService.getAllActiveJoiningWords();
}
@Put(':id')
update(
  @Param('id') id: number,
  @Body() updateJoiningWordDto: UpdateJoiningWordDto
) {
  return this.joiningWordsService.updateJoiningWord(id, updateJoiningWordDto);
}


}
