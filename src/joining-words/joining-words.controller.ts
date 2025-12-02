import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { JoiningWordsService } from './joining-words.service';
import { CreateJoiningWordDto } from './dto/create-joining-word.dto';
import { UpdateJoiningWordDto } from './dto/update-joining-word.dto';
import { DeleteJoiningWordsDto } from './dto/delete-joining-words.dto';


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
updateJoiningWord(
	@Param('id') id: number,
	@Body() updateJoiningWordDto: UpdateJoiningWordDto
) {
	return this.joiningWordsService.updateJoiningWord(id, updateJoiningWordDto);
}

@Put('/updateJoiningWords/:id')
deleteJoiningWords(
  @Param('id') id: number,
  @Body() deleteJoiningWordsDto: DeleteJoiningWordsDto
) {
  return this.joiningWordsService.deleteJoiningWords(id, deleteJoiningWordsDto);
}


}
