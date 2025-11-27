import { CountriesInfo } from 'src/county_sources/entities/county_info.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';


@Entity('upload_scheduler')
export class UploadScheduler {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  country_id: number;
  
   @Column({ type: 'varchar', length: 255 })
  platform: string;

  @Column({ type: 'varchar', length: 255 })
  key: string;

  @Column({ type: 'text', nullable: true })
  value?: string;

  @CreateDateColumn({ type: 'timestamp' })
  datetime: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  modified_datetime: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  operator?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  status?: string;

  @ManyToOne(() => CountriesInfo, (country) => country.uploadSchedulers, {
	onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'country_id' })
  country: CountriesInfo;
}
