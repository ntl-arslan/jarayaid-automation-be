import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUploadSchedulerDto } from './dto/create-upload-scheduler.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { UploadScheduler } from './entities/upload-scheduler.entity';
import { Repository } from 'typeorm';
import { CountriesInfo } from 'src/county_sources/entities/county_info.entity';
import { UpdateUploadSchedulerDto } from './dto/update-upload-scheduler.dto';
@Injectable()
export class UploadSchedulerService {
	 constructor(
		@InjectRepository(UploadScheduler)
		private readonly uploadSchedulerRepo: Repository<UploadScheduler>,
		@InjectRepository(CountriesInfo)
		private readonly countriesInfoRepo: Repository<CountriesInfo>,
	) {}
	
	 async createUploadScheduler(createUploadSchedulerDto: CreateUploadSchedulerDto) {
		try {
			
			const isCountryExists = await this.countriesInfoRepo.findOne({
	where: {
		id: createUploadSchedulerDto.country_id,
		status: 'ACTIVE',
	},
});

if (!isCountryExists) {
	return {
		status: 'FAILURE',
		statusCode: HttpStatus.NOT_FOUND,
		message: `Country with ID ${createUploadSchedulerDto.country_id} not found or inactive`,
		data: [],
	};
}

			const scheduler = this.uploadSchedulerRepo.create({
				...createUploadSchedulerDto,
				datetime: new Date(),
				modified_datetime: new Date(),
				status: 'ACTIVE',
			});
			const saved = await this.uploadSchedulerRepo.save(scheduler);

			return {
				status: 'SUCCESS',
				statusCode: HttpStatus.CREATED,
				message: 'Upload scheduler created successfully',
				data: saved,
			};
		} catch (err) {
			console.error(err);
			return {
				status: 'FAILURE',
				statusCode: HttpStatus.EXPECTATION_FAILED,
				message: 'Failed to create upload scheduler',
				data: err.message,
			};
		}
	}

async getAllUploadSchedulers() {
	try {
		// Fetch all schedulers with country info
		const schedulers = await this.uploadSchedulerRepo.find({
			relations: ['country'],
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
		const result = schedulers.reduce((acc, item) => {
			const countryId = item.country_id;

			if (!acc[countryId]) {
				acc[countryId] = {
					COUNTRY_ID: countryId,
					COUNTRY_NAME: item.country?.country_name || '',
				 // PLATFORMS: {}, // each platform will have its keys as columns
				};
			}

			if (!acc[countryId][item.platform]) {
				acc[countryId][item.platform] = {};
			}

			// Add key-value pair to the specific platform
			acc[countryId][item.platform][item.key] = item.value;

			// Optional: include other common fields per platform
			// acc[countryId].PLATFORMS[item.platform]['UPLOAD_FREQUENCY'] =
			//   item.UPLOAD_FREQUENCY || 'DAILY';

			return acc;
		}, {} as Record<number, any>);

		// Convert object to array
		const data = Object.values(result);

		return {
			status: 'SUCCESS',
			statusCode: HttpStatus.OK,
			message: 'All upload schedulers pivoted successfully by platform and key',
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
  .leftJoinAndSelect('scheduler.country', 'country')
  .where('scheduler.status = :schedulerStatus', { schedulerStatus: 'ACTIVE' })
  .andWhere('country.status = :countryStatus', { countryStatus: 'ACTIVE' })
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
		const result = schedulers.reduce((acc, item) => {
			const countryId = item.country_id;

			if (!acc[countryId]) {
				acc[countryId] = {
					COUNTRY_ID: countryId,
					COUNTRY_NAME: item.country?.country_name || '',
				 // PLATFORMS: {}, // each platform will have its keys as columns
				};
			}

			if (!acc[countryId][item.platform]) {
				acc[countryId][item.platform] = {};
			}

			// Add key-value pair to the specific platform
			acc[countryId][item.platform][item.key] = item.value;

			// Optional: include other common fields per platform
			// acc[countryId].PLATFORMS[item.platform]['UPLOAD_FREQUENCY'] =
			//   item.UPLOAD_FREQUENCY || 'DAILY';

			return acc;
		}, {} as Record<number, any>);

		// Convert object to array
		const data = Object.values(result);

		return {
			status: 'SUCCESS',
			statusCode: HttpStatus.OK,
			message: 'All upload schedulers pivoted successfully by platform and key',
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
    const existingScheduler = await this.uploadSchedulerRepo.findOne({ where: { id } });
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
    const updatedScheduler = await this.uploadSchedulerRepo.findOne({ where: { id } });

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
        relations: ['country'],
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






}
