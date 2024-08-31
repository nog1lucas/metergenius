import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Customer } from '../../customer/entities/customer.entity';

export enum MeasureType {
  WATER = 'water',
  GAS = 'gas',
}

@Entity()
export class Measure  {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Customer, (customer) => customer.measures)
  @JoinColumn({name: 'customer_id'})
  customer!: Customer;

  @Column({
    type: 'enum',
    enum: MeasureType,
  })
  type!: MeasureType;

  @Column()
  value!: number;

  @Column()
  image_url!: string; 

  @Column({ default: false })
  has_confirmed!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn()
  deleted_at!: Date;
}
