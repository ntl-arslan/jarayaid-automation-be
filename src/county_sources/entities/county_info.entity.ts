import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { CountrySources } from './country_source.entity';
import { UploadScheduler } from 'src/upload-scheduler/entities/upload-scheduler.entity';
import { ScriptGeneration } from 'src/script-generation/entities/script-generation.entity';

@Entity('countries_info')
export class CountriesInfo {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'int' })
	country_id: number;


	@Column({ type: 'varchar', length: 100, nullable: true })
	type?: string;

	@Column({ type: 'varchar', length: 100, nullable: true })
	operator?: string;

	@CreateDateColumn({ type: 'timestamp' })
	datetime: Date;

	@UpdateDateColumn({ type: 'timestamp' })
	modified_datetime: Date;

	@Column({ type: 'varchar', length: 50, nullable: true })
	status?: string;


	// @OneToMany(() => UploadScheduler, (scheduler) => scheduler.country)
	// uploadSchedulers: UploadScheduler[];

	@OneToMany(() => ScriptGeneration, (sg) => sg.country)
	scripts: ScriptGeneration[];
	
	
}

