import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Customer } from './customer.entity';

export enum MeasureType {
  WATER = 'WATER',
  GAS = 'GAS',
}

@Entity()
export class Reading {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @ManyToOne(() => Customer, (customer) => customer.consumptionRecords)
  @JoinColumn()
  customer!: Customer;

  @Column({
    type: 'enum',
    enum: MeasureType,
  })
  type!: MeasureType;

  @Column({ type: 'float' })
  amount!: number;

  @Column({ type: 'date' })
  readingDate!: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;
}
