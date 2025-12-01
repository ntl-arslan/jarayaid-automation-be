import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ScriptGenerationService } from './script-generation.service';
import { CreateScriptGenerationDto } from './dto/create-script-generation.dto';
import { UpdateScriptGenerationDto } from './dto/update-script-generation.dto';

@Controller('script-generation')
export class ScriptGenerationController {
	constructor(private readonly scriptGenerationService: ScriptGenerationService) {}

	@Get()
	getScriptGeneration() {
		return this.scriptGenerationService.getScriptGeneration();
	}
	


	
}
