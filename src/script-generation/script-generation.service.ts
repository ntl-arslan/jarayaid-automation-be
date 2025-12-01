import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateScriptGenerationDto } from './dto/create-script-generation.dto';
import { UpdateScriptGenerationDto } from './dto/update-script-generation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CountriesInfo } from 'src/county_sources/entities/county_info.entity';
import { ExternalApiService } from 'src/external-apis.service';
import { ScriptGeneration } from './entities/script-generation.entity';

@Injectable()
export class ScriptGenerationService {
		constructor(
			@InjectRepository(CountriesInfo)
			private readonly countriesInfo: Repository<CountriesInfo>,
			@InjectRepository(ScriptGeneration)
			private readonly scriptGenerationRepo: Repository<ScriptGeneration>,
			private readonly externalApiService: ExternalApiService,
		) {}
async getScriptGeneration() {
	try {
		let allCountriesData = [];

		// 1. Fetch all countries from external API
		const getAllCountries = await this.externalApiService.getAllCountries();

		if (getAllCountries.status !== 'SUCCESS') {
			return {
				status: 'FAILURE',
				statusCode: HttpStatus.CONFLICT,
				message: 'No Country Exists',
				data: [],
			};
		}

		allCountriesData = getAllCountries.data; // external API countries list

		// 2. Get script generation records using query builder
	 const scriptGeneration = await this.scriptGenerationRepo
	.createQueryBuilder('sg')
	.innerJoinAndSelect('sg.country', 'ci') 
	.where('ci.type = :type', { type: 'MANUAL' })
	.andWhere('ci.status = :status', { status: 'ACTIVE' })
	.orderBy('sg.datetime', 'DESC')
	.getMany();
		if (scriptGeneration.length === 0) {
			return {
				status: 'FAILURE',
				statusCode: HttpStatus.NOT_FOUND,
				message: 'No script generation records found',
				data: [],
			};
		}
		console.log(allCountriesData,'scriptGeneration');
		// 3. Merge external API country info using ci.country_id mapping
		const finalResult = scriptGeneration.map((record: any) => {
			const ci = record.country;

			// find external country by ID
			const externalCountry = allCountriesData.find(
				(ext: any) => ext.id === ci.country_id,
			);

			return {
				id: record.id,
		prompt:	 record.prompt,
		status:	 record.status,
		approval_status:	record.approval_status,
			video_gen_status: record.video_gen_status,
			operator:	 record.operator,
		datetime:	 record.datetime,
				modified_datetime: record.modified_datetime,
					country_name:externalCountry.name,
					country_id:externalCountry.id
			};
		});


		return {
			status: 'SUCCESS',
			statusCode: HttpStatus.OK,
			message: 'Script generation fetched successfully',
			data: finalResult,
		};
	} catch (err) {
		console.error('Error fetching script generation:', err);
		return {
			status: 'FAILURE',
			statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
			message: 'Error fetching script generation',
			data: err.message,
		};
	}
}

}
