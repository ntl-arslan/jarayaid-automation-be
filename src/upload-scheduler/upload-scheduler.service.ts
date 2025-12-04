import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUploadSchedulerDto } from './dto/create-upload-scheduler.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadScheduler } from './entities/upload-scheduler.entity';
import { Repository } from 'typeorm';
import { CountriesInfo } from 'src/county_sources/entities/county_info.entity';
import { UpdateUploadSchedulerDto } from './dto/update-upload-scheduler.dto';
import { DeleteUploadSchedulerDto } from './dto/delete-upload-scheduler.dto';
import { UpdateBulkSchedulerDto } from './dto/bulk-update-scheduler.dto';
@Injectable()
export class UploadSchedulerService {
	constructor(
		@InjectRepository(UploadScheduler)
		private readonly uploadSchedulerRepo: Repository<UploadScheduler>,
		@InjectRepository(CountriesInfo)
		private readonly countriesInfoRepo: Repository<CountriesInfo>,
	) {}

	async createUploadScheduler(
	createUploadSchedulerDto: CreateUploadSchedulerDto,
) {
	try {
		const results = [];
		const schedulers = createUploadSchedulerDto.schedulers;

		for (const item of schedulers) {
	 
			const scheduler = this.uploadSchedulerRepo.create({
				...item,
				datetime: new Date(),
				modified_datetime: new Date(),
				status: 'ACTIVE',
			});

			const saved = await this.uploadSchedulerRepo.save(scheduler);

			results.push({
				country_id: item.country_id,
				status: 'SUCCESS',
				data: saved,
			});
		}

		return {
			status: 'SUCCESS',
			statusCode: HttpStatus.CREATED,
			message: 'Upload schedulers processed',
			data: results,
		};
	} catch (err) {
		console.error(err);
		return {
			status: 'FAILURE',
			statusCode: HttpStatus.EXPECTATION_FAILED,
			message: 'Failed to process upload schedulers',
			data: err.message,
		};
	}
}


	async getAllUploadSchedulers() {
		try {
			// Fetch all schedulers with country info
			const schedulers = await this.uploadSchedulerRepo.find({
				
			});

			if (schedulers.length === 0) {
				return {
					status: 'FAILURE',
					statusCode: HttpStatus.NOT_FOUND,
					message: 'No upload schedulers found',
					data: [],
				};
			}

			// Pivot key-value pairs per country and platform
			const result = schedulers.reduce(
				(acc, item) => {
					const countryId = item.country_id;

					if (!acc[countryId]) {
						acc[countryId] = {
							COUNTRY_ID: countryId,
						
							// PLATFORMS: {}, // each platform will have its keys as columns
						};
					}

					if (!acc[countryId][item.platform]) {
						acc[countryId][item.platform] = {};
					}

					// Add key-value pair to the specific platform
					acc[countryId][item.platform][item.key] = item.value;
						 acc[countryId]['STATUS'] = item.status;
					// Optional: include other common fields per platform
					// acc[countryId].PLATFORMS[item.platform]['UPLOAD_FREQUENCY'] =
					//   item.UPLOAD_FREQUENCY || 'DAILY';

					return acc;
				},
				{} as Record<number, any>,
			);

			// Convert object to array
			const data = Object.values(result);

			return {
				status: 'SUCCESS',
				statusCode: HttpStatus.OK,
				message:
					'All upload schedulers pivoted successfully by platform and key',
				data,
			};
		} catch (err) {
			console.error('Error fetching upload schedulers:', err);
			return {
				status: 'FAILURE',
				statusCode: HttpStatus.EXPECTATION_FAILED,
				message: 'Error fetching upload schedulers',
				data: err.message,
			};
		}
	}
	async getAllActiveUploadSchedulers() {
		try {
			// Fetch all schedulers with country info
			const schedulers = await this.uploadSchedulerRepo
				.createQueryBuilder('scheduler')
			 
				.where('scheduler.status = :schedulerStatus', {
					schedulerStatus: 'ACTIVE',
				})
			 
				.getMany();

			if (schedulers.length === 0) {
				return {
					status: 'FAILURE',
					statusCode: HttpStatus.NOT_FOUND,
					message: 'No upload schedulers found',
					data: [],
				};
			}

			// Pivot key-value pairs per country and platform
			const result = schedulers.reduce(
				(acc, item) => {
					const countryId = item.country_id;

					if (!acc[countryId]) {
						acc[countryId] = {
							COUNTRY_ID: item.country_id,
						
							// PLATFORMS: {}, // each platform will have its keys as columns
						};
					}

					if (!acc[countryId][item.platform]) {
						acc[countryId][item.platform] = {};
					}

					// Add key-value pair to the specific platform
					acc[countryId][item.platform][item.key] = item.value;
					acc[countryId]['STATUS'] = item.status;


					// Optional: include other common fields per platform
					// acc[countryId].PLATFORMS[item.platform]['UPLOAD_FREQUENCY'] =
					//   item.UPLOAD_FREQUENCY || 'DAILY';

					return acc;
				},
				{} as Record<number, any>,
			);

			// Convert object to array
			const data = Object.values(result);

			return {
				status: 'SUCCESS',
				statusCode: HttpStatus.OK,
				message:
					'All upload schedulers pivoted successfully by platform and key',
				data,
			};
		} catch (err) {
			console.error('Error fetching upload schedulers:', err);
			return {
				status: 'FAILURE',
				statusCode: HttpStatus.EXPECTATION_FAILED,
				message: 'Error fetching upload schedulers',
				data: err.message,
			};
		}
	}

	async updateUploadScheduler(id: number, updateDto: UpdateUploadSchedulerDto) {
		try {
			// Check if the scheduler exists
			const existingScheduler = await this.uploadSchedulerRepo.findOne({
				where: { id },
			});
			if (!existingScheduler) {
				return {
					status: 'FAILURE',
					statusCode: HttpStatus.NOT_FOUND,
					message: `Upload scheduler with ID ${id} not found`,
					data: [],
				};
			}

			// Update fields and modified timestamp
			const result = await this.uploadSchedulerRepo.update(id, {
				...updateDto,
				modified_datetime: new Date(),
			});

			if (result.affected === 0) {
				return {
					status: 'FAILURE',
					statusCode: HttpStatus.BAD_REQUEST,
					message: 'No changes made or invalid data',
					data: [],
				};
			}

			// Fetch updated scheduler
			const updatedScheduler = await this.uploadSchedulerRepo.findOne({
				where: { id },
			});

			return {
				status: 'SUCCESS',
				statusCode: HttpStatus.OK,
				message: 'Upload scheduler updated successfully',
				data: updatedScheduler,
			};
		} catch (err) {
			console.error('Error updating upload scheduler:', err);
			return {
				status: 'FAILURE',
				statusCode: HttpStatus.EXPECTATION_FAILED,
				message: 'Failed to update upload scheduler',
				data: err.message,
			};
		}
	}
	async getUploadSchedulerByID(id: number) {
		try {
			const scheduler = await this.uploadSchedulerRepo.findOne({
				where: { id },
			
			});

			if (!scheduler) {
				return {
					status: 'FAILURE',
					statusCode: HttpStatus.NOT_FOUND,
					message: `Upload scheduler with ID ${id} not found`,
					data: [],
				};
			}

			return {
				status: 'SUCCESS',
				statusCode: HttpStatus.OK,
				message: 'Upload scheduler fetched successfully',
				data: scheduler,
			};
		} catch (err) {
			console.error('Error fetching upload scheduler:', err);
			return {
				status: 'FAILURE',
				statusCode: HttpStatus.EXPECTATION_FAILED,
				message: 'Error fetching upload scheduler',
				data: err.message,
			};
		}
	}
	async getUploadSchedulerByCountryID(countryID: number) {
		try {
			const schedulers = await this.uploadSchedulerRepo.find({
 
				where: { country_id: countryID },
			});
			 
			if (schedulers.length === 0) {
				return {
					status: 'FAILURE',
					statusCode: HttpStatus.NOT_FOUND,
					message: `No upload schedulers found for country ID ${countryID}`,
					data: [],
				};
			}

			const result = schedulers.reduce(
				(acc, item) => {
					const countryId = item.country_id;

					if (!acc[countryId]) {
						acc[countryId] = {
							COUNTRY_ID: countryId,
						
						};
					}

					if (!acc[countryId][item.platform]) {
						acc[countryId][item.platform] = {};
					}

					acc[countryId][item.platform][item.key] = item.value;
					acc[countryId]['STATUS'] = item.status;
					return acc;
				},
				{} as Record<number, any>,
			);

			// Convert object to array
			const data = Object.values(result);

			return {
				status: 'SUCCESS',
				statusCode: HttpStatus.OK,
				message: `Upload schedulers for country ID ${countryID} pivoted successfully by platform and key`,
				data,
			};
		} catch (err) {
			console.error('Error fetching upload schedulers:', err);
			return {
				status: 'FAILURE',
				statusCode: HttpStatus.EXPECTATION_FAILED,
				message: 'Error fetching upload schedulers',
				data: err.message,
			};
		}
	}

	async updateSchedulerByCountryID(countryID: number, deleteUploadSchedulerDto: DeleteUploadSchedulerDto) {
  try {
	
	const isExists = await this.uploadSchedulerRepo.findOne({
	  where: { country_id: countryID },
	});

	if (!isExists) {
	  return {
		status: 'FAILURE',
		statusCode: HttpStatus.NOT_FOUND,
		message: 'No scheduler found for this country ID',
		data: [],
	  };
	}

	const allowedStatuses = ['ACTIVE', 'INACTIVE'];
		if (deleteUploadSchedulerDto.status && !allowedStatuses.includes(deleteUploadSchedulerDto.status)) {
			return {
				status: 'FAILURE',
				statusCode: HttpStatus.BAD_REQUEST,
				message: `Status must be one of: ${allowedStatuses.join(', ')}`,
				data: [],
			};
		}
	const { status, operator } = deleteUploadSchedulerDto;

	await this.uploadSchedulerRepo.update(
	  { country_id: countryID },
	  {
		status: status,
		operator: operator,
		modified_datetime: () => 'NOW()',
	  }
	);

	return {
	  status: 'SUCCESS',
	  statusCode: HttpStatus.OK,
	  message: 'Scheduler updated successfully',
	  data: {
		country_id: countryID,
		status,
		operator,
	  },
	};
  } catch (err) {
	return {
	  status: 'FAILURE',
	  statusCode: HttpStatus.EXPECTATION_FAILED,
	  message: 'Error updating status of upload scheduler',
	  data: err.message,
	};
  }
}


 async bulkUpdateScheduler(updateBulkSchedulerDto: UpdateBulkSchedulerDto) {
	try {
	  const dataArray = updateBulkSchedulerDto.items;

	  for (const item of dataArray) {
		if (item?.id) {
		  await this.uploadSchedulerRepo.update(
			{ id: item.id } as any,
			{
			  ...item,
			  modified_datetime: new Date(),
			} as any,
		  );
		} else {
		  await this.uploadSchedulerRepo.save({
			...item,
			datetime: new Date(),
			modified_datetime: new Date(),
			status: 'INACTIVE',
		  } as any);
		}
	  }

	  return {
		status: 'SUCCESS',
		statusCode: HttpStatus.OK,
		message: 'Scheduler Updated Successfully',
		data: [],
	  };
	} catch (err) {
	  console.error('Bulk update error:', err);
	  return {
		status: 'FAILURE',
		statusCode: HttpStatus.EXPECTATION_FAILED,
		message: 'Error Updating Scheduler',
		data: [],
	  };
	}
  }

}
