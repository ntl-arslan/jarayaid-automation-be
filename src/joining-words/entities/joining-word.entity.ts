import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'joining_words' })
export class JoiningWords {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'joining_word', type: 'varchar', length: 255 })
  joining_word: string;

  @Column({ type: 'varchar', length: 20, default: 'ACTIVE' })
  status: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  operator: string;

  @CreateDateColumn({ name: 'datetime', type: 'timestamp' })
  datetime: Date;

  @UpdateDateColumn({ name: 'modified_datetime', type: 'timestamp' })
  modified_datetime: Date;
}
