import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ScriptConfigurationService } from './script-configuration.service';
import { CreateScriptConfigurationDto } from './dto/create-script-configuration.dto';
import { UpdateScriptConfigurationDto } from './dto/update-script-configuration.dto';
import { DeleteScriptConfigurationDto } from './dto/delete-script-configuration.dto';


@Controller('script-configuration')
export class ScriptConfigurationController {
	constructor(private readonly scriptConfigurationService: ScriptConfigurationService) {}

	@Post()
	async createScriptConfiguration(@Body() createScriptConfigurationDto: CreateScriptConfigurationDto) {
		return this.scriptConfigurationService.createScriptConfiguration(createScriptConfigurationDto);
	}
	
	@Get()
getAllScriptConfigurations() {
	return this.scriptConfigurationService.getAllScriptConfigurations();
}

@Put(':id')
updateScriptConfiguration(
  @Param('id') id: number,
  @Body() updateDto: UpdateScriptConfigurationDto,
) {
  return this.scriptConfigurationService.updateScriptConfiguration(id, updateDto);
}

@Put('/updateScriptConfiguration/:id')
deleteScriptConfiguration(
	@Param('id') id: number,
	@Body() deleteScriptConfigurationDto: DeleteScriptConfigurationDto
) {
	return this.scriptConfigurationService.deleteScriptConfiguration(id, deleteScriptConfigurationDto);
}



}
