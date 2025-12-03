import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCountriesInfoDto, CreateCountrySourceDto } from './dto/create-county_source.dto';
import { CountriesInfo } from './entities/county_info.entity';
import { UpdateCountriesInfoDto } from './dto/update-county_source.dto';
import { DeleteCountryInfoDto } from './dto/delete-country_source.dt';
import { CountryType } from 'src/constants/constants';
import { CountrySources } from './entities/country_source.entity';
import { UpdateSourceDto } from './dto/update-source.dto';

@Injectable()
export class CountySourcesService {
	constructor(
		@InjectRepository(CountriesInfo)
		private readonly countriesInfoRepo: Repository<CountriesInfo>,
		@InjectRepository(CountrySources)
		private readonly countrySourcesRepo: Repository<CountrySources>,
	) {}

	async createCountrySources(createCountrySourceDto: CreateCountriesInfoDto) {
		try {
			const existingCountry = await this.countriesInfoRepo.findOne({
				where: { country_id: createCountrySourceDto.country_id },
				// relations: ['sources'],
			});

			if (existingCountry) {
				return {
					status: 'FAILURE',
					statusCode: HttpStatus.CONFLICT,
					message: 'Country already exists',
					data: existingCountry,
				};
			}

			// 2️⃣ Create country entity
			const country = this.countriesInfoRepo.create({
				country_id: createCountrySourceDto.country_id,
			
				type: createCountrySourceDto.type,
				operator: createCountrySourceDto.operator,
				status: 'ACTIVE',
				datetime: new Date(),
				modified_datetime: new Date(),
			});

			const savedCountry = await this.countriesInfoRepo.save(country);

			// 3️⃣ Save sources if provided
			if (
				createCountrySourceDto.sources &&
				createCountrySourceDto.sources.length
			) {
				for (const s of createCountrySourceDto.sources) {
					// Check if this source already exists for this country
					const existingSource = await this.countrySourcesRepo.findOne({
						where: {
					
							news_source: s.news_source, // unique at country level
						},
					});

					if (existingSource) {
						continue; // skip duplicate source
					}

					const sourceEntity = this.countrySourcesRepo.create({
					
						source: s.source_name,
						news_source: s.news_source,
						type: s.source_type,
						operator: createCountrySourceDto.operator,
						status: 'ACTIVE',
						joining_words: s.joining_words,
						intro_music_path: s.intro_music_path,
						datetime: new Date(),
						modified_datetime: new Date(),
					});

					await this.countrySourcesRepo.save(sourceEntity);
				}
			}

			// 4️⃣ Fetch country with sources to return
			const countryWithSources = await this.countriesInfoRepo.findOne({
				where: { id: savedCountry.id },
				// relations: ['sources'],
			});

			return {
				status: 'SUCCESS',
				statusCode: HttpStatus.CREATED,
				message: 'Country and sources created successfully',
				data: countryWithSources,
			};
		} catch (err) {
			console.error('Error creating country with sources:', err);

			return {
				status: 'FAILURE',
				statusCode: HttpStatus.EXPECTATION_FAILED,
				message: 'Failed to create country and sources',
				data: err.message,
			};
		}
	}
	async createSource (createCountrySourceDto:CreateCountrySourceDto) 
	{
		try
		{
		const saveObj=
		{
			...createCountrySourceDto,
			datetime: new Date(),
			modified_datetime: new Date(),
			status:'ACTIVE'
		}
		const saveResponse=await this.countrySourcesRepo.save(saveObj);
		if(saveResponse)
			{
					return {
				status: 'SUCCESS',
				statusCode: HttpStatus.OK,
				message: 'Source Created Successfully',
				data: saveResponse,
			};
			}
			else
				{
						return {
				status: 'FAILURE',
				statusCode: HttpStatus.CONFLICT,
				message: 'Source Does Not Created Successfully',
				data: [],
			};
				}
		}catch(err)
		{
			 console.error('Error creating sources:', err);
			return {
				status: 'FAILURE',
				statusCode: HttpStatus.EXPECTATION_FAILED,
				message: 'Error Creating Sources',
				data: [],
			};
		}
	}

	async getAllCountySources() {
		try {
			// Fetch all countries with their sources
			const getAllCountySources = await this.countriesInfoRepo.find({
		 
			});

			if (getAllCountySources.length > 0) {
				return {
					status: 'SUCCESS',
					statusCode: HttpStatus.OK,
					message: 'Country Sources Fetched Successfully',
					data: getAllCountySources,
				};
			} else {
				return {
					status: 'FAILURE',
					statusCode: HttpStatus.NOT_FOUND,
					message: 'No Country Sources found',
					data: [],
				};
			}
		} catch (err) {
			console.error('Error fetching country sources:', err);
			return {
				status: 'FAILURE',
				statusCode: HttpStatus.EXPECTATION_FAILED,
				message: 'Error Fetching Country Sources',
				data: [],
			};
		}
	}

	async updateCountrySources(
		id: number,
		updateCountriesInfoDto: UpdateCountriesInfoDto,
	) {
		try {
			const country = await this.countriesInfoRepo.findOne({
				where: { id: id } as unknown,
			});

			if (!country) {
				return {
					status: 'FAILURE',
					statusCode: HttpStatus.NOT_FOUND,
					message: 'No Such Country Found',
					data: [],
				};
			}
			const updateObj = {
				...updateCountriesInfoDto,
				modified_datetime: new Date(),
			};
			await this.countriesInfoRepo.update(id, updateObj);

			return {
				status: 'SUCCESS',
				statusCode: HttpStatus.OK,
				message: 'Country Updated Successfully',
				data: updateCountriesInfoDto,
			};
		} catch (err) {
			console.error('Error updating country:', err);
			return {
				status: 'FAILURE',
				statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				message: 'Failed To Update Country',
				data: err.message,
			};
		}
	}
	async deleteCountrySources(
		id: number,
		deleteCountryInfoDto: DeleteCountryInfoDto,
	) {
		try {
			const country = await this.countriesInfoRepo.findOne({
				where: { id: id } as unknown,
			});

			if (!country) {
				return {
					status: 'FAILURE',
					statusCode: HttpStatus.NOT_FOUND,
					message: 'No Such Country Found',
					data: [],
				};
			}
			const updateObj = {
				modified_datetime: new Date(),
				status: 'INACTIVE',
				operator: deleteCountryInfoDto.operator,
			};
			await this.countriesInfoRepo.update(id, updateObj);

			return {
				status: 'SUCCESS',
				statusCode: HttpStatus.OK,
				message: 'Country Deleted Successfully',
				data: [],
			};
		} catch (err) {
			console.error('Error updating country:', err);
			return {
				status: 'FAILURE',
				statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				message: 'Failed To Update Country',
				data: err.message,
			};
		}
	}
	async getAllActiveCountySources() {
		try {
			const getAllCountySources = await this.countriesInfoRepo.find({
				where: { status: 'ACTIVE' },
		 
			});

			const filteredCountries = getAllCountySources.map((country) => ({
				...country,
			 
			}));

			if (filteredCountries.length > 0) {
				return {
					status: 'SUCCESS',
					statusCode: HttpStatus.OK,
					message: 'Active Country Sources Fetched Successfully',
					data: filteredCountries,
				};
			} else {
				return {
					status: 'FAILURE',
					statusCode: HttpStatus.NOT_FOUND,
					message: 'No Active Country Sources found',
					data: [],
				};
			}
		} catch (err) {
			console.error('Error fetching active country sources:', err);
			return {
				status: 'FAILURE',
				statusCode: HttpStatus.EXPECTATION_FAILED,
				message: 'Error Fetching Active Country Sources',
				data: [],
			};
		}
	}

	// async getAllCountySourcesByType(type: string) {
	//   try {
	//     if (type !== CountryType.AUTO && type !== CountryType.MANUAL) {
	//       return {
	//         status: 'FAILURE',
	//         statusCode: HttpStatus.BAD_REQUEST,
	//         message: 'Invalid Country Type Provided',
	//         data: [],
	//       };
	//     }

	//     const getAllCountySources = await this.countriesInfoRepo.find({
	//       where: {
	//         status: 'ACTIVE',
	//         type: type,
	//       },
			
	//     });

	 

	//     if (filteredCountries.length > 0) {
	//       return {
	//         status: 'SUCCESS',
	//         statusCode: HttpStatus.OK,
	//         message: `Active ${type} Country Sources Fetched Successfully`,
	//         data: filteredCountries,
	//       };
	//     } else {
	//       return {
	//         status: 'FAILURE',
	//         statusCode: HttpStatus.NOT_FOUND,
	//         message: `No ${type} Active Country Sources found`,
	//         data: [],
	//       };
	//     }
	//   } catch (err) {
	//     console.error('Error fetching active country sources by type:', err);
	//     return {
	//       status: 'FAILURE',
	//       statusCode: HttpStatus.EXPECTATION_FAILED,
	//       message: 'Error Fetching Active Country Sources',
	//       data: [],
	//     };
	//   }
	// }

	async getSourcesByCountryID(countryID: string) {
		try {
			const sources = await this.countrySourcesRepo.find({
				where: { jarayid_country_id: countryID },
			
			});

	 

			if (sources?.length === 0) {
				return {
					status: 'FAILURE',
					statusCode: HttpStatus.NOT_FOUND,
					message: 'No active sources found for this country',
					data: [],
				};
			}

			return {
				status: 'SUCCESS',
				statusCode: HttpStatus.OK,
				message: `Sources fetched successfully for country ID ${countryID}`,
				data: sources,
			};
		} catch (err) {
			console.error('Error fetching sources by country ID:', err);
			return {
				status: 'FAILURE',
				statusCode: HttpStatus.EXPECTATION_FAILED,
				message: 'Error fetching sources',
				data: [],
			};
		}
	}
	async updateCountrySourceByID(
		sourceID: number,
		updateSourceDto: UpdateSourceDto,
	) {
		try {
			const existingSource = await this.countrySourcesRepo.findOne({
				where: { id: sourceID },
			});

			if (!existingSource) {
				return {
					status: 'FAILURE',
					statusCode: HttpStatus.NOT_FOUND,
					message: 'Source not found',
					data: [],
				};
			}

			// Perform update
			await this.countrySourcesRepo.update(sourceID, {
				...updateSourceDto,
				modified_datetime: new Date(),
			});

			// Fetch updated source
			const updatedSource = await this.countrySourcesRepo.findOne({
				where: { id: sourceID },
			});

			return {
				status: 'SUCCESS',
				statusCode: HttpStatus.OK,
				message: 'Source updated successfully',
				data: updatedSource,
			};
		} catch (err) {
			console.error('Error updating source:', err);
			return {
				status: 'FAILURE',
				statusCode: HttpStatus.EXPECTATION_FAILED,
				message: 'Failed to update source',
				data: err.message,
			};
		}
	}
}
