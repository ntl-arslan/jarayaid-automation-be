import { 
	Entity, PrimaryGeneratedColumn, Column, ManyToOne,
	CreateDateColumn, UpdateDateColumn, JoinColumn 
} from 'typeorm';
import { CountriesInfo } from './county_info.entity';


@Entity('country_sources')
export class CountrySources {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar', length: 255, nullable: true })
	source?: string;

	@Column({ type: 'varchar', length: 255, nullable: true })
	news_source?: string;

	@Column({ type: 'varchar', length: 50, nullable: true })
	status?: string;

	@Column({ type: 'int', nullable: true })
	article_count?: number;

	@Column({ type: 'int', nullable: true })
	sequence?: number;

	@Column({ type: 'varchar', length: 100, nullable: true })
	type?: string;

	@Column({ type: 'varchar', length: 100, nullable: true })
	operator?: string;

	@Column({ type: 'text', nullable: true })
	joining_words?: string;

	@Column({ type: 'varchar', length: 500, nullable: true })
	intro_music_path?: string;
	
	@Column({ type: 'int', nullable: true })
	jarayid_source_id?: string;

	@CreateDateColumn({ type: 'timestamp' })
	datetime: Date;

	@UpdateDateColumn({ type: 'timestamp' })
	modified_datetime: Date;
	
	 @Column({ type: 'varchar', length: 250, nullable: true })
  jarayid_country_id?: string;
	

}
