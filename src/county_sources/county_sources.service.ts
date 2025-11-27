import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCountriesInfoDto } from './dto/create-county_source.dto';
import { CountriesInfo } from './entities/county_source.entity';
import { UpdateCountriesInfoDto } from './dto/update-county_source.dto';
import { DeleteCountryInfoDto } from './dto/delete-country_source.dt';
import { CountryType } from 'src/constants/constants';

@Injectable()
export class CountySourcesService {
	constructor(
		@InjectRepository(CountriesInfo)
		private readonly countriesInfoRepo: Repository<CountriesInfo>,
	) {}

	async createCountrySources(createCountrySourceDto: CreateCountriesInfoDto) {
		try {
		 const saveObj=
		 {
		 	...createCountrySourceDto,
			date_time: new Date(),
			modified_date: new Date(),
			status:"ACTIVE"
		 }
			const savedCountry = await this.countriesInfoRepo.save(saveObj);

			return {
				status: "SUCCESS",
				statusCode: HttpStatus.CREATED,
				message: 'Country Created Successfully',
				data: savedCountry,
			};
		} catch (err) {
			console.error('Error creating country:', err);

			return {
				status: "FAILURE",
				statusCode: HttpStatus.EXPECTATION_FAILED,
				message: 'Failed To Create Country',
				data: err.message,
			};
		}
	}
	async getAllCountySources() 	
	{
		try
		{
			const getAllCountySources=await this.countriesInfoRepo.find();
			if(getAllCountySources.length >0)
				{
					return {
						status: "SUCCESS",
						statusCode: HttpStatus.OK,
						message: 'Country Sources Fetched Successfully',
						data: getAllCountySources
					}
						
				}else
					{
						return {
						status: "FAILURE",
						statusCode: HttpStatus.NOT_FOUND,
						message: 'No Country Sources found',
						data:[]
						}
					}
		}catch(err)
		{
			return {
						status: "FAILURE",
						statusCode: HttpStatus.EXPECTATION_FAILED,
						message: 'Error Fetching Country Sources',
						data:[]
						}
		}
	}
	 async updateCountrySources(id: number, updateCountriesInfoDto: UpdateCountriesInfoDto) {
		try {
			const country = await this.countriesInfoRepo.findOne({ where: { id: id } as unknown });

			if (!country) {
				 return {
				status: 'FAILURE',
				statusCode: HttpStatus.NOT_FOUND,
				message: 'No Such Country Found',
				data: [],
			};
			}
				const updateObj=
				{
					...updateCountriesInfoDto,
					modified_datetime: new Date(),
				}
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
	 async deleteCountrySources(id: number,deleteCountryInfoDto: DeleteCountryInfoDto) {
		try {
			const country = await this.countriesInfoRepo.findOne({ where: { id: id } as unknown });

			if (!country) {
				 return {
				status: 'FAILURE',
				statusCode: HttpStatus.NOT_FOUND,
				message: 'No Such Country Found',
				data: [],
			};
			}
				const updateObj=
				{
					modified_datetime: new Date(),
					status: 'INACTIVE',
					operator:deleteCountryInfoDto.operator
				}
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
	async getAllActiveCountySources() 
	{
		try
		{
			const getAllCountySources=await this.countriesInfoRepo.find({where:
				{
					status:"ACTIVE"
				}});
			if(getAllCountySources)
				{
					return {
						status: "SUCCESS",
						statusCode: HttpStatus.OK,
						message: 'ActiveCountry Sources Fetched Successfully',
						data: getAllCountySources
					}
						
				}else
					{
						return {
						status: "FAILURE",
						statusCode: HttpStatus.NOT_FOUND,
						message: 'No Active Country Sources found',
						data:[]
						}
					}
		}catch(err)
		{
			return {
						status: "FAILURE",
						statusCode: HttpStatus.EXPECTATION_FAILED,
						message: 'Error Fetching Active Country Sources',
						data:[]
						}
		}
	}
	async getAllCountySourcesByType(type: string) 
	{
		try
		{
		if (type !== CountryType.AUTO && type !== CountryType.MANUAL) {
  return {
    status: 'FAILURE',
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Invalid Country Type Provided',
    data: [],
  };
}
			const getAllCountySources=await this.countriesInfoRepo.find({where:
				{
					status:"ACTIVE",
					type:type
				}});
			
			if(getAllCountySources.length >0)
				{
					return {
						status: "SUCCESS",
						statusCode: HttpStatus.OK,
						message: `Active ${type} Country Sources Fetched Successfully`,
						data: getAllCountySources
					}
						
				}else
					{
						return {
						status: "FAILURE",
						statusCode: HttpStatus.NOT_FOUND,
						message: `No ${type} Active Country Sources found`,
						data:[]
						}
					}
		}catch(err)
		{
			return {
						status: "FAILURE",
						statusCode: HttpStatus.EXPECTATION_FAILED,
						message: 'Error Fetching Active Country Sources',
						data:[]
						}
		}
	}
}
