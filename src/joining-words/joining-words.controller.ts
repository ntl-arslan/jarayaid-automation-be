import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JoiningWordsService } from './joining-words.service';
import { CreateJoiningWordDto } from './dto/create-joining-word.dto';


@Controller('joining-words')
export class JoiningWordsController {
  constructor(private readonly joiningWordsService: JoiningWordsService) {}

  @Post()
  create(@Body() createJoiningWordDto: CreateJoiningWordDto) {
    return this.joiningWordsService.createJoiningWords(createJoiningWordDto);
  }

}
