
import { ScriptGeneration } from 'src/script-generation/entities/script-generation.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'script_configuration' })
export class ScriptConfiguration {
  @PrimaryGeneratedColumn()
  id: number;



  @Column({ name: 'key', type: 'varchar', length: 255 })
  key: string;

  @Column({ name: 'value', type: 'text', nullable: true })
  value: string;

  @Column({ name: 'sequence', type: 'int', nullable: true })
  sequence: number;

  @Column({ name: 'operator', type: 'varchar', length: 100, nullable: true })
  operator: string;

  @Column({ name: 'status', type: 'varchar', length: 20, default: 'ACTIVE' })
  status: string;

  @CreateDateColumn({ name: 'datetime', type: 'timestamp' })
  datetime: Date;

  @UpdateDateColumn({ name: 'modified_datetime', type: 'timestamp' })
  modified_datetime: Date;

}
