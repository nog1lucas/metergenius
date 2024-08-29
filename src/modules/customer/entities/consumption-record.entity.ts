import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Customer } from './customer.entity';

@Entity()
export class ConsumptionRecord {

  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  customer!: Customer;

  @Column({ type: 'enum', enum: ['WATER', 'GAS'] })
  type!: 'WATER' | 'GAS';

  @Column({ type: 'float' })
  amount!: number;

  @Column({ type: 'date' })
  readingDate!: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;
}