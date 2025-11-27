import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UploadSchedulerService } from './upload-scheduler.service';
import { CreateUploadSchedulerDto } from './dto/create-upload-scheduler.dto';
import { UpdateUploadSchedulerDto } from './dto/update-upload-scheduler.dto';

@Controller('upload-scheduler')
export class UploadSchedulerController {
	constructor(private readonly uploadSchedulerService: UploadSchedulerService) {}

	@Post()
	create(@Body() createUploadSchedulerDto: CreateUploadSchedulerDto) {
		return this.uploadSchedulerService.createUploadScheduler(createUploadSchedulerDto);
	}
	@Get()
	getAllUploadSchedulers() {
		return this.uploadSchedulerService.getAllUploadSchedulers();
	}

}
