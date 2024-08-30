import { Injectable } from '@nestjs/common';
import { Between, DataSource, Repository } from 'typeorm';
import { MeasureType, Measure } from '../entities/measure.entity';

@Injectable()
export class MeasureRepository extends Repository<Measure> {
  constructor(private readonly dataSource: DataSource) {
    super(Measure, dataSource.createEntityManager());
  }

  /**
   * Check if already exists measure in these month for a specific type of measure.
   * @param userId to check signerKey for.
   * @returns The signerKey if exists, otherwise null.
   */
  async isMeasurementExists(customerCode: string, measureType: MeasureType): Promise<boolean> {
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
