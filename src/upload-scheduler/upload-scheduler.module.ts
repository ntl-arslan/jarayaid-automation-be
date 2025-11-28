import { Module } from '@nestjs/common';
import { UploadSchedulerService } from './upload-scheduler.service';
import { UploadSchedulerController } from './upload-scheduler.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadScheduler } from './entities/upload-scheduler.entity';
import { CountriesInfo } from 'src/county_sources/entities/county_info.entity';
import { CountrySources } from 'src/county_sources/entities/country_source.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UploadScheduler, CountriesInfo, CountrySources]),
  ],
  controllers: [UploadSchedulerController],
  providers: [UploadSchedulerService],
})
export class UploadSchedulerModule {}
