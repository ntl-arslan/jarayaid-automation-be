import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCountriesInfoDto } from './dto/create-county_source.dto';
import { CountriesInfo } from './entities/county_source.entity';
import { UpdateCountriesInfoDto } from './dto/update-county_source.dto';

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
				message: 'Country created successfully',
				data: savedCountry,
			};
		} catch (err) {
			console.error('Error creating country:', err);

			return {
				status: "FAILURE",
				statusCode: HttpStatus.EXPECTATION_FAILED,
				message: 'Failed to create country',
				data: err.message, // include the error message
			};
		}
	}
	async getAllCountySources() 
	{
		try
		{
			const getAllCountySources=await this.countriesInfoRepo.find();
			if(getAllCountySources)
				{
					return {
						status: "SUCCESS",
						statusCode: HttpStatus.OK,
						message: 'Country Sources fetched successfully',
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
        message: 'Country updated successfully',
        data: updateCountriesInfoDto,
      };
    } catch (err) {
      console.error('Error updating country:', err);
      return {
        status: 'FAILURE',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to update country',
        data: err.message,
      };
    }
  }
}
