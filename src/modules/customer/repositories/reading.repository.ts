import { Injectable } from '@nestjs/common';
import { Between, DataSource, Repository } from 'typeorm';
import { MeasureType, Reading } from '../entities/reading.entity';

@Injectable()
export class ReadingRepository extends Repository<Reading> {
  constructor(private readonly dataSource: DataSource) {
    super(Reading, dataSource.createEntityManager());
  }

  /**
   * Check if signerKey exists for the contract's supplier.
   * @param userId to check signerKey for.
   * @returns The signerKey if exists, otherwise null.
   */
  async isReadingExists(customerCode: string, measureType: MeasureType): Promise<boolean> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    const count = await this.count({
      where: {
        customer: {id: customerCode},
        type: measureType,
        created_at: Between(startOfMonth, endOfMonth),
      },
    });

    return count > 0;
  }
}
