import { Injectable } from '@nestjs/common';
import { Between, DataSource, Repository } from 'typeorm';
import { MeasureType, Measure } from '../entities/measure.entity';

@Injectable()
export class MeasureRepository extends Repository<Measure> {
  constructor(private readonly dataSource: DataSource) {
    super(Measure, dataSource.createEntityManager());
  }


   /**
 * Checks if a measure exists for a specific customer and type within the month of the given date.
 * @param customerId The code of the customer for which the measure should be checked.
 */
    async checkCustomerExists(customerId: string): Promise<boolean> {
      const count = await this.count({
        where: {
          customer: { id: customerId },
        },
      });
      return count > 0;
    }

  /**
 * Checks if a measure exists for a specific customer and type within the month of the given date.
 * @param customer_code The code of the customer for which the measure should be checked.
 * @param measure_type The type of measure to check.
 * @param measure_datetime The date and time of the measure to determine the month.
 * @returns `true` if a corresponding measure already exists within the specified month, otherwise `false`.
 */
  async isMeasurementExists(
    customer_code: string,
    measure_type: MeasureType,
    measure_datetime: string
  ): Promise<boolean> {
    const measureDate = new Date(measure_datetime);
  
    const startOfMonth = new Date(measureDate.getFullYear(), measureDate.getMonth(), 1, 0, 0, 0, 0);
    const endOfMonth = new Date(measureDate.getFullYear(), measureDate.getMonth() + 1, 0, 23, 59, 59, 999);
  
    const existingMeasure = await this.findOne({
      where: {
        customer: { id: customer_code },
        type: measure_type,
        created_at: Between(startOfMonth, endOfMonth),
      },
    });
  
    return existingMeasure !== null;
  }
  
}
