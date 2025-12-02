import { Module } from '@nestjs/common';
import { JoiningWordsService } from './joining-words.service';
import { JoiningWordsController } from './joining-words.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JoiningWords } from './entities/joining-word.entity';

@Module({
	 imports: [
				TypeOrmModule.forFeature([JoiningWords])
			],
	controllers: [JoiningWordsController],
	providers: [JoiningWordsService],
})
export class JoiningWordsModule {}
