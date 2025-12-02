import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateJoiningWordDto } from './dto/create-joining-word.dto';
import { UpdateJoiningWordDto } from './dto/update-joining-word.dto';
import { JoiningWords } from './entities/joining-word.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteJoiningWordsDto } from './dto/delete-joining-words.dto';

@Injectable()
export class JoiningWordsService {
		constructor(
			@InjectRepository(JoiningWords)
			private readonly joiningWordRepo: Repository<JoiningWords>,
			
		) {}
	
	
	async createJoiningWords(createJoiningWordDto: CreateJoiningWordDto) {
	try {
		
		const existing = await this.joiningWordRepo.find({
			where: {
				joining_word: createJoiningWordDto.joining_word,
				status: 'ACTIVE',
			},
		});

		if (existing.length > 0) {
			return {
				status: 'FAILURE',
				statusCode: HttpStatus.CONFLICT,
				message: 'Joining word already exists',
				data: [],
			};
		}

		// Prepare object for DB insert
		const saveObj = {
			...createJoiningWordDto,
			status: 'ACTIVE',
			datetime: new Date(),
			modified_datetime: new Date(),
		};

		const saveResponse = await this.joiningWordRepo.save(saveObj);

		if (saveResponse) {
			return {
				status: 'SUCCESS',
				statusCode: HttpStatus.OK,
				message: 'Joining word saved successfully',
				data: saveResponse,
			};
		} else {
			return {
				status: 'FAILURE',
				statusCode: HttpStatus.BAD_REQUEST,
				message: 'Joining word could not be saved',
				data: [],
			};
		}
	} catch (err) {
		console.error(err);
		return {
			status: 'FAILURE',
			statusCode: HttpStatus.EXPECTATION_FAILED,
			message: 'Error saving joining word',
			data: err.message,
		};
	}
}
async getAllActiveJoiningWords() {
	try {
		const activeWords = await this.joiningWordRepo.find({
			where: { status: 'ACTIVE' },
			order: { datetime: 'DESC' },
		});

		return {
			status: 'SUCCESS',
			statusCode: HttpStatus.OK,
			message: 'Active joining words fetched successfully',
			data: activeWords,
		};
	} catch (err) {
		console.error('Error fetching active joining words:', err);

		return {
			status: 'FAILURE',
			statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
			message: 'Failed to fetch joining words',
			data: err.message,
		};
	}
}
async getAllJoiningWords() {
	try {
		const activeWords = await this.joiningWordRepo.find({
			order: { datetime: 'DESC' },
		});

		return {
			status: 'SUCCESS',
			statusCode: HttpStatus.OK,
			message: 'All joining words fetched successfully',
			data: activeWords,
		};
	} catch (err) {
		console.error('Error fetching active joining words:', err);

		return {
			status: 'FAILURE',
			statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
			message: 'Failed to fetch joining words',
			data: err.message,
		};
	}
}
async updateJoiningWord(id: number, updateDto:UpdateJoiningWordDto) {
	try {
		const existing = await this.joiningWordRepo.findOne({ where: { id } });

		if (!existing) {
			return {
				status: 'FAILURE',
				statusCode: HttpStatus.NOT_FOUND,
				message: 'Joining word not found',
				data: [],
			};
		}

		const updateJoiningWords=await this.joiningWordRepo.update(id, {
			...updateDto,
			modified_datetime: new Date(),
		} as unknown);

	 if (updateJoiningWords.affected) {
	const updatedRecord = await this.joiningWordRepo.findOne({ where: { id } });
	return {
		status: 'SUCCESS',
		statusCode: HttpStatus.OK,
		message: 'Joining word updated successfully',
		data: updatedRecord,
	};
}

		else
			{
					return {
			status: 'FAILURE',
			statusCode: HttpStatus.BAD_REQUEST,
			message: 'Joining word does not updated successfully',
			data: [],
		};
			}

		
	} catch (err) {
		console.error('Error updating joining word:', err);

		return {
			status: 'FAILURE',
			statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
			message: 'Failed to update joining word',
			data: err.message,
		};
	}
}

async deleteJoiningWords(id: number, deleteJoiningWordsDto: DeleteJoiningWordsDto) {
	try {
		const existing = await this.joiningWordRepo.findOne({ where: { id } });

		if (!existing) {
			return {
				status: 'FAILURE',
				statusCode: HttpStatus.NOT_FOUND,
				message: 'Joining word not found',
				data: [],
			};
		}

		

		// Validate status from FE
		const allowedStatuses = ['ACTIVE', 'INACTIVE'];
		if (deleteJoiningWordsDto.status && !allowedStatuses.includes(deleteJoiningWordsDto.status)) {
			return {
				status: 'FAILURE',
				statusCode: HttpStatus.BAD_REQUEST,
				message: `Status must be one of: ${allowedStatuses.join(', ')}`,
				data: [],
			};
		}

		const updateJoiningWords = await this.joiningWordRepo.update(id, {
			...deleteJoiningWordsDto,
			modified_datetime: new Date(),
		});

		if (updateJoiningWords.affected) {
			const updatedRecord = await this.joiningWordRepo.findOne({ where: { id } });
			return {
				status: 'SUCCESS',
				statusCode: HttpStatus.OK,
				message: `Joining word ${deleteJoiningWordsDto.status} successfully`,
				data: updatedRecord,
			};
		} else {
			return {
				status: 'FAILURE',
				statusCode: HttpStatus.BAD_REQUEST,
				message: `Joining word was not ${deleteJoiningWordsDto.status} successfully`,
				data: [],
			};
		}
	} catch (err) {
		console.error('Error deleting joining word:', err);
		return {
			status: 'FAILURE',
			statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
			message: 'Failed to delete joining word',
			data: err.message,
		};
	}
}





}
