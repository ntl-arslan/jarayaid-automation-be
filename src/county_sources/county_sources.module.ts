import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountySourcesService } from './county_sources.service';
import { CountySourcesController } from './county_sources.controller';
import { CountriesInfo } from './entities/county_info.entity';
import { CountrySources } from './entities/country_source.entity';
import { UploadScheduler } from 'src/upload-scheduler/entities/upload-scheduler.entity';


@Module({
  imports: [TypeOrmModule.forFeature([CountriesInfo,CountrySources,UploadScheduler])],
  controllers: [CountySourcesController],
  providers: [CountySourcesService],
})
export class CountySourcesModule {}
