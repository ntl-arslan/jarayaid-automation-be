import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class ExternalApiService {
  constructor(private readonly httpService: HttpService) {}
    
  async getCountryById(country_id: number) {
  try {
    const response = await firstValueFrom(
      this.httpService
        .get(`${process.env.JARAYID_BE_URL}/admin-dashboard/getCategories`)
        .pipe(
          map(res => res.data),
          catchError(err => {
            throw new HttpException(
              'Failed to fetch categories',
              HttpStatus.BAD_GATEWAY,
            );
          }),
        ),
    );

    const country = response.data.find(
      (c: any) => c.ID === Number(country_id) && c.TYPE === 'country',
    );

    if (!country) {
      throw new HttpException('Country not found', HttpStatus.NOT_FOUND);
    }

    return {
      id: country.ID,
      name: country.NAME,
      arabic_name: country.ARABIC_NAME,
      status: country.STATUS,
      sequence: country.SEQUENCE,
    };
  } catch (err) {
    throw new HttpException(
      err.message,
      err.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

}
