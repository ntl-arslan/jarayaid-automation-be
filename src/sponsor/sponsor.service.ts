import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateSponsorDto } from './dto/create-sponsor.dto';
import { UpdateSponsorDto } from './dto/update-sponsor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sponsor } from './entities/sponsor.entity';
import { Repository } from 'typeorm';
import { SponsorCountry } from 'src/sponsor-countries/entities/sponsor-country.entity';
import { ExternalApiService } from 'src/external-apis.service';

@Injectable()
export class SponsorService {
	constructor(
		@InjectRepository(Sponsor)
		private readonly sponsorRepo: Repository<Sponsor>,
		@InjectRepository(SponsorCountry)
		private readonly sponsorCountriesRepo: Repository<SponsorCountry>,
		private readonly externalApiService: ExternalApiService,
	) {}
	
	async createSponsor(createSponsorDto: CreateSponsorDto) {
		try {
			if (createSponsorDto.startdate && createSponsorDto.enddate) {
				const start = new Date(createSponsorDto.startdate);
				const end = new Date(createSponsorDto.enddate);

				if (start.getTime() === end.getTime()) {
					return {
						status: 'FAILURE',
						statusCode: HttpStatus.CONFLICT,
						message: 'Start date and end date cannot be the same',
						data: [],
					};
				}

				if (end.getTime() < start.getTime()) {
					return {
						status: 'FAILURE',
						statusCode: HttpStatus.CONFLICT,
						message: 'End date must be greater than start date',
						data: [],
					};
				}
			}

			const existingSponsor = await this.sponsorRepo.findOne({
				where: { name: createSponsorDto.name },
			});

			if (existingSponsor) {
				return {
					status: 'FAILURE',
					statusCode: HttpStatus.CONFLICT,
					message: `Sponsor with name "${createSponsorDto.name}" already exists`,
					data: existingSponsor,
				};
			}

			const sponsor = this.sponsorRepo.create({
				name: createSponsorDto.name,
				website: createSponsorDto.website,
				startdate: createSponsorDto.startdate,
				enddate: createSponsorDto.enddate,
				status: createSponsorDto.status ?? 'ACTIVE',
				operator: createSponsorDto.operator,
				datetime: new Date(),
				modified_datetime: new Date(),
				logo: createSponsorDto.logo
			});

			const savedSponsor = await this.sponsorRepo.save(sponsor);

			const sponsorCountries = [];

			for (const country of createSponsorDto.countries) {
				const existingCountry = await this.sponsorCountriesRepo.findOne({
					where: {
						sponsor_id: savedSponsor.id,
						country_id: country.country_id,
					},
				});

				if (existingCountry) continue;

				const sc = this.sponsorCountriesRepo.create({
					sponsor_id: savedSponsor.id,
					country_id: country.country_id,
					status: country.status ?? 'ACTIVE',
					operator: country.operator ?? createSponsorDto.operator,
					datetime: new Date(),
					modified_datetime: new Date(),
				});

				const savedSC = await this.sponsorCountriesRepo.save(sc);
				sponsorCountries.push(savedSC);
			}

			return {
				status: 'SUCCESS',
				statusCode: HttpStatus.OK,
				message: 'Sponsor and countries created successfully',
				data: {
					sponsor: savedSponsor,
					countries: sponsorCountries,
				},
			};
		} catch (err) {
			console.error(err);
			return {
				status: 'FAILURE',
				statusCode: HttpStatus.EXPECTATION_FAILED,
				message: 'Failed to create sponsor',
				data: err.message,
			};
		}
	}
async getAllSponsors() {
  try {
    const sponsors = await this.sponsorRepo.find();
    const result = [];

    for (const sponsor of sponsors) {
      const countries = await this.sponsorCountriesRepo.find({
        where: { sponsor_id: sponsor.id },
      });

      const countriesWithName = [];

      for (const country of countries) {
        try {
          const countryData = await this.externalApiService.getCountryById(
            country.country_id,
          );

         
          if (countryData) {
            countriesWithName.push({
              country_id: country.country_id,
              country_name: countryData.name,
              status: country.status,
              operator: country.operator,
            });
          }
        } catch (err) {
          
          continue;
        }
      }

      result.push({
        id: sponsor.id,
        name: sponsor.name,
        website: sponsor.website,
        startdate: sponsor.startdate,
        enddate: sponsor.enddate,
        status: sponsor.status,
        operator: sponsor.operator,
						logo: sponsor.logo,
        countries: countriesWithName,
      });
    }

    return {
      status: 'SUCCESS',
      statusCode: HttpStatus.OK,
      message: 'Sponsors fetched successfully',
      data: result,
    };
  } catch (err) {
    return {
      status: 'FAILURE',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to fetch sponsors',
      data: err.message,
    };
  }
}
async getAllActiveSponsors() {
  try {
    const sponsors = await this.sponsorRepo.find({
      where: { status: 'ACTIVE' },
    });
    const result = [];

    for (const sponsor of sponsors) {
     
      const countries = await this.sponsorCountriesRepo.find({
        where: { sponsor_id: sponsor.id, status: 'ACTIVE' },
      });

      const countriesWithName = [];

      for (const country of countries) {
        try {
          const countryData = await this.externalApiService.getCountryById(
            country.country_id,
          );

         
          if (countryData && countryData.status.toLowerCase() === 'active') {
            countriesWithName.push({
              country_id: country.country_id,
              country_name: countryData.name,
              status: country.status,
              operator: country.operator,
            });
          }
        } catch (err) {
         
          continue;
        }
      }

     
      if (countriesWithName.length > 0) {
        result.push({
          id: sponsor.id,
          name: sponsor.name,
          website: sponsor.website,
          startdate: sponsor.startdate,
          enddate: sponsor.enddate,
          status: sponsor.status,
          operator: sponsor.operator,
					logo: sponsor.logo,
          countries: countriesWithName,
        });
      }
    }

    return {
      status: 'SUCCESS',
      statusCode: HttpStatus.OK,
      message: 'Active sponsors fetched successfully',
      data: result,
    };
  } catch (err) {
    return {
      status: 'FAILURE',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to fetch sponsors',
      data: err.message,
    };
  }
}

async updateSponsor(id: number, updateSponsorDto: UpdateSponsorDto) {
  try {
    // 1️⃣ Check if sponsor exists
    const sponsor = await this.sponsorRepo.findOne({ where: { id } });
    if (!sponsor) {
      return {
        status: 'FAILURE',
        statusCode: HttpStatus.NOT_FOUND,
        message: `Sponsor with ID ${id} not found`,
        data: [],
      };
    }

    // 2️⃣ Validate dates
    if (updateSponsorDto.startdate && updateSponsorDto.enddate) {
      const start = new Date(updateSponsorDto.startdate);
      const end = new Date(updateSponsorDto.enddate);

      if (start.getTime() === end.getTime()) {
        return {
          status: 'FAILURE',
          statusCode: HttpStatus.CONFLICT,
          message: 'Start date and end date cannot be the same',
          data: [],
        };
      }
      if (end.getTime() < start.getTime()) {
        return {
          status: 'FAILURE',
          statusCode: HttpStatus.CONFLICT,
          message: 'End date must be greater than start date',
          data: [],
        };
      }
    }

    // 3️⃣ Update parent sponsor (exclude countries)
    const { countries, ...parentFields } = updateSponsorDto;
    await this.sponsorRepo.update(id, {
      ...parentFields,
      modified_datetime: new Date(),
    });

    // Fetch updated sponsor to return
    const updatedSponsor = await this.sponsorRepo.findOne({ where: { id } });

    // 4️⃣ Update child countries
    if (countries?.length) {
      const existingCountries = await this.sponsorCountriesRepo.find({
        where: { sponsor_id: id },
      });

      const payloadCountryIds = countries.map(c => c.country_id);

      // a) Deactivate countries missing in the new payload
      const missingCountries = existingCountries.filter(
        ec => !payloadCountryIds.includes(ec.country_id),
      );
      for (const mc of missingCountries) {
        await this.sponsorCountriesRepo.update(
          { id: mc.id },
          { status: 'INACTIVE', modified_datetime: new Date() },
        );
      }

      // b) Update existing or create new countries
      for (const country of countries) {
        const existing = existingCountries.find(
          ec => ec.country_id === country.country_id,
        );

        if (existing) {
          await this.sponsorCountriesRepo.update(
            { id: existing.id },
            {
              status: country.status ?? 'ACTIVE',
              operator: country.operator ?? updateSponsorDto.operator,
              modified_datetime: new Date(),
            },
          );
        } else {
          const sc = this.sponsorCountriesRepo.create({
            sponsor_id: id, // must set sponsor_id
            country_id: country.country_id,
            status: country.status ?? 'ACTIVE',
            operator: country.operator ?? updateSponsorDto.operator,
            datetime: new Date(),
            modified_datetime: new Date(),
          });
          await this.sponsorCountriesRepo.save(sc);
        }
      }
    }

    return {
      status: 'SUCCESS',
      statusCode: HttpStatus.OK,
      message: 'Sponsor updated successfully',
      data: {
        sponsor: updatedSponsor,
      },
    };
  } catch (err) {
    return {
      status: 'FAILURE',
      statusCode: HttpStatus.EXPECTATION_FAILED,
      message: 'Failed to update sponsor',
      data: err.message,
    };
  }
}







}
