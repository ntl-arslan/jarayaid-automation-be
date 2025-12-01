
import { CountriesInfo } from 'src/county_sources/entities/county_info.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'script_generation' })
export class ScriptGeneration {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	country_info_id: number;

	@Column({ name: 'prompt', type: 'text', nullable: true })
	prompt: string;

	@Column({ name: 'status', type: 'varchar', length: 20, default: 'ACTIVE' })
	status: string;

	@Column({ name: 'approval_status', type: 'varchar', length: 20, default: 'PENDING' })
	approval_status: string;

	@Column({ name: 'video_gen_status', type: 'varchar', length: 20, default: 'PENDING' })
	video_gen_status: string;

	@Column({ name: 'operator', type: 'varchar', length: 100, nullable: true })
	operator: string;

	@CreateDateColumn({ name: 'datetime', type: 'timestamp' })
	datetime: Date;

	@UpdateDateColumn({ name: 'modified_datetime', type: 'timestamp' })
	modified_datetime: Date;
	
	@Column({ name: 'cancellation_remarks', type: 'varchar', length: 250, nullable: true })
cancellation_remarks?: string;

	@ManyToOne(() => CountriesInfo, (country) => country.scripts, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'country_info_id' })
	country: CountriesInfo;
}


