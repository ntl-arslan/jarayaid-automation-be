import { Module } from '@nestjs/common';
import { ScriptConfigurationService } from './script-configuration.service';
import { ScriptConfigurationController } from './script-configuration.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScriptConfiguration } from './entities/script-configuration.entity';
import { ScriptGeneration } from 'src/script-generation/entities/script-generation.entity';

@Module({
	 imports: [
					TypeOrmModule.forFeature([ScriptConfiguration])
				],
	controllers: [ScriptConfigurationController],
	providers: [ScriptConfigurationService],
})
export class ScriptConfigurationModule {}
