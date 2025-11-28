import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { UploadSchedulerService } from './upload-scheduler.service';
import { CreateUploadSchedulerDto } from './dto/create-upload-scheduler.dto';
import { UpdateUploadSchedulerDto } from './dto/update-upload-scheduler.dto';

@Controller('upload-scheduler')
export class UploadSchedulerController {
  constructor(
    private readonly uploadSchedulerService: UploadSchedulerService,
  ) {}

  @Post()
  create(@Body() createUploadSchedulerDto: CreateUploadSchedulerDto) {
    return this.uploadSchedulerService.createUploadScheduler(
      createUploadSchedulerDto,
    );
  }
  @Get()
  getAllUploadSchedulers() {
    return this.uploadSchedulerService.getAllUploadSchedulers();
  }
  @Get('active')
  getAllActiveUploadSchedulers() {
    return this.uploadSchedulerService.getAllActiveUploadSchedulers();
  }
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateUploadSchedulerDto: UpdateUploadSchedulerDto,
  ) {
    return await this.uploadSchedulerService.updateUploadScheduler(
      id,
      updateUploadSchedulerDto,
    );
  }

  @Get(':id')
  async getUploadSchedulerByID(@Param('id', ParseIntPipe) id: number) {
    return await this.uploadSchedulerService.getUploadSchedulerByID(id);
  }
  @Get('country/:countryID')
  async getUploadSchedulerByCountryID(
    @Param('countryID', ParseIntPipe) countryID: number,
  ) {
    return await this.uploadSchedulerService.getUploadSchedulerByCountryID(
      countryID,
    );
  }
}
