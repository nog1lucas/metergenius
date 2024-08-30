import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Customer } from '../../customer/entities/customer.entity';

export enum MeasureType {
  WATER = 'WATER',
  GAS = 'GAS',
}

@Entity()
export class Measure  {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @ManyToOne(() => Customer, (customer) => customer.measures)
  @JoinColumn()
  customer!: Customer;

  @Column({
    type: 'enum',
    enum: MeasureType,
  })
  type!: MeasureType;

  @Column({ type: 'float' })
  consumption_value!: number;

  @CreateDateColumn()
  created_at!: Date;
}
