import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class DubbingContractsRepository extends Repository<DubbingContracts> {
  constructor(private readonly dataSource: DataSource) {
    super(DubbingContracts, dataSource.createEntityManager());
  }

  async findById(id: number): Promise<DubbingContracts> {
    return await this.findOneBy({ id });
  }

  /**
   * Check if signerKey exists for the contract's supplier.
   * @param userId to check signerKey for.
   * @returns The signerKey if exists, otherwise null.
   */
  async findSignerKeyByUserId(userId: number): Promise<string | null> {
    const contract = await this.createQueryBuilder('dc')
      .select('dc.signerKey')
      .leftJoin('dc.user', 'user')
      .where('user.id = :userId', { userId })
      .getOne();

    return contract ? contract.signerKey : null;
  }

  async getThreeDayUnsigned() {
    const today = new Date();
    today.setDate(today.getDate() - 3);
    const threeDaysAgo = new Date(today);
    return await this.createQueryBuilder('dc')
      .select(['dc.requestSignatureKey', 'user.fullName'])
      .leftJoin('dc.user', 'user')
      .where('dc.status = :status', { status: DubbingContractStatus.INPROCESS })
      .andWhere('dc.createdAt <= :dateLimit', { dateLimit: threeDaysAgo })
      .orderBy('dc.createdAt', 'ASC')
      .getMany();
  }

  async countInProgressContracts(projectId: number): Promise<number> {
    let offset = 0;
    let inProgressContractsCount = 0;
    let contracts;

    do {
      contracts = await this.find({
        where: {
          project: { id: projectId },
          status: DubbingContractStatus.INPROCESS,
        },
        take: 100,
        skip: offset,
      });

      inProgressContractsCount += contracts.length;
      offset += contracts.length;
    } while (contracts.length > 0);

    return inProgressContractsCount;
  }

  /**
   * Checks if a document key exists in the dubbing contracts.
   * @param key The document key to check for existence.
   * @returns true if exists, false otherwise.
   */
  async hasDocumentKey(documentKey: string): Promise<boolean> {
    const count = await this.count({
      where: { documentKey },
      cache: true,
    });

    return count > 0;
  }
}
