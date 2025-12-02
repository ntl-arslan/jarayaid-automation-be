import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateScriptConfigurationDto } from './dto/create-script-configuration.dto';
import { UpdateScriptConfigurationDto } from './dto/update-script-configuration.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ScriptConfiguration } from './entities/script-configuration.entity';
import { Repository } from 'typeorm';
import { SCRIPT_CONFIGURATION_KEYS } from 'src/constants/constants';

@Injectable()
export class ScriptConfigurationService {
	constructor(
				@InjectRepository(ScriptConfiguration)
				private readonly scriptConfigurationRepo: Repository<ScriptConfiguration>,
			
			) {}
	async createScriptConfiguration(createDto: CreateScriptConfigurationDto) {
	try {
		if (!Object.values(SCRIPT_CONFIGURATION_KEYS).includes(createDto.key as SCRIPT_CONFIGURATION_KEYS)) {
      return {
        status: 'FAILURE',
        statusCode: HttpStatus.BAD_REQUEST,
        message: `Invalid key. Allowed keys are: ${Object.values(SCRIPT_CONFIGURATION_KEYS).join(', ')}`,
        data: [],
      };
    }
		
		const existing = await this.scriptConfigurationRepo.findOne({
			where: { key: createDto.key, status: 'ACTIVE' },
		});

		if (existing) {
			return {
				status: 'FAILURE',
				statusCode: HttpStatus.CONFLICT,
				message: 'Script configuration with this key already exists',
				data: existing,
			};
		}

		const saveObj = {
			key: createDto.key,
			value: createDto.value,
			sequence: createDto.sequence,
			operator: createDto.operator,
			status: 'ACTIVE',
			datetime: new Date(),
			modified_datetime: new Date(),
		};

		const saved = await this.scriptConfigurationRepo.save(saveObj);

		return {
			status: 'SUCCESS',
			statusCode: HttpStatus.OK,
			message: 'Script configuration saved successfully',
			data: saved,
		};
	} catch (err) {
		console.error('Error creating script configuration:', err);
		return {
			status: 'FAILURE',
			statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
			message: 'Failed to create script configuration',
			data: err.message,
		};
	}
}

async getAllScriptConfigurations() {
	try {
		const configurations = await this.scriptConfigurationRepo.find({
		 
			order: {  datetime: 'DESC' },
		});

		if (!configurations || configurations.length === 0) {
			return {
				status: 'FAILURE',
				statusCode: HttpStatus.NOT_FOUND,
				message: 'No script configuration records found',
				data: [],
			};
		}

		return {
			status: 'SUCCESS',
			statusCode: HttpStatus.OK,
			message: 'Script configuration records fetched successfully',
			data: configurations,
		};
	} catch (err) {
		console.error('Error fetching script configurations:', err);
		return {
			status: 'FAILURE',
			statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
			message: 'Failed to fetch script configuration records',
			data: err.message,
		};
	}
}

async updateScriptConfiguration(
	id: number,
	updateDto: UpdateScriptConfigurationDto,
) {
	try {
		const existing = await this.scriptConfigurationRepo.findOne({ where: { id } });

		if (!existing) {
			return {
				status: 'FAILURE',
				statusCode: HttpStatus.NOT_FOUND,
				message: 'Script configuration not found',
				data: [],
			};
		}

		const updateObj = {
			...updateDto,
			modified_datetime: new Date(),
		};

		const updateResult = await this.scriptConfigurationRepo.update(id, updateObj);

		if (updateResult.affected) {
			const updatedRecord = await this.scriptConfigurationRepo.findOne({ where: { id } });
			return {
				status: 'SUCCESS',
				statusCode: HttpStatus.OK,
				message: 'Script configuration updated successfully',
				data: updatedRecord,
			};
		} else {
			return {
				status: 'FAILURE',
				statusCode: HttpStatus.BAD_REQUEST,
				message: 'Script configuration was not updated successfully',
				data: [],
			};
		}
	} catch (err) {
		console.error('Error updating script configuration:', err);
		return {
			status: 'FAILURE',
			statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
			message: 'Failed to update script configuration',
			data: err.message,
		};
	}
}




 
}
