import { SponsorCountry } from 'src/sponsor-countries/entities/sponsor-country.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';


@Entity({ name: 'sponsor' })
export class Sponsor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255, nullable: true })
  website: string;

  @Column({ type: 'date', nullable: true })
  startdate: Date;

  @Column({ type: 'date', nullable: true })
  enddate: Date;

  @Column({ length: 20, default: 'ACTIVE' })
  status: string;

  @Column({ length: 100, nullable: true })
  operator: string;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  datetime: Date;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  modified_datetime: Date;
  
   @Column({ length: 255 })
  logo: string;

  @OneToMany(() => SponsorCountry, (sc) => sc.sponsor)
  countries: SponsorCountry[];
}
