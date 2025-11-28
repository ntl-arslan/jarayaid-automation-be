import { Sponsor } from 'src/sponsor/entities/sponsor.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';


@Entity({ name: 'sponsor_countries' })
export class SponsorCountry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sponsor_id: number;

  @Column()
  country_id: number;

  @Column({ length: 20, default: 'ACTIVE' })
  status: string;

  @Column({ length: 100, nullable: true })
  operator: string;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  datetime: Date;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  modified_datetime: Date;

  @ManyToOne(() => Sponsor, (sponsor) => sponsor.countries, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sponsor_id' })
  sponsor: Sponsor;
}

