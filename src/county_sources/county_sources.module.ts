import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountySourcesService } from './county_sources.service';
import { CountySourcesController } from './county_sources.controller';
import { CountriesInfo } from './entities/county_source.entity';


@Module({
  imports: [TypeOrmModule.forFeature([CountriesInfo])],
  controllers: [CountySourcesController],
  providers: [CountySourcesService],
})
export class CountySourcesModule {}
