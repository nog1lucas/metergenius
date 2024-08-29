import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ConsumptionRecord } from './consumption-record.entity';

@Entity()
export class Customer {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  phoneNumber!: string;

  @Column()
  address!: string;

  @Column()
  city!: string;

  @Column()
  state!: string;

  @Column()
  postalCode!: string;

  @Column({ type: 'enum', enum: ['INDIVIDUAL', 'COMPANY'] })
  customerType!: 'INDIVIDUAL' | 'COMPANY'; // Tipo de cliente: pessoa física ou jurídica

  @Column({ nullable: true })
  firstName?: string; // Nome (só para pessoas físicas)

  @Column({ nullable: true })
  lastName?: string; // Sobrenome (só para pessoas físicas)

  @Column({ nullable: true })
  companyName?: string; // Nome da empresa (só para pessoas jurídicas)

  @Column({ nullable: true })
  taxId?: string; // CPF ou CNPJ, dependendo do tipo de cliente

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @OneToMany(() => ConsumptionRecord, (record) => record.customer)
  consumptionRecords!: ConsumptionRecord[];
}