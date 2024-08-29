// import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
// import { Injectable } from '@nestjs/common';
// import { Customer } from './customer.entity';

// @Injectable()
// export class CustomerRepository implements EntityRepository<Customer> {
//   constructor(private entityManager: EntityManager) {}

//   async add(entity: Customer): Promise<void> {
//     this.entityManager.persist(entity);
//   }

//   findById(id: string): Promise<Customer> {
//     return this.entityManager.findOne(Customer, id);
//   }

//   findByIds(ids: string[]): Promise<Customer[]> {
//     return this.entityManager.find(Customer, { id: { $in: ids } });
//   }

//   findAll(): Promise<Customer[]> {
//     return this.entityManager.find(Customer, {});
//   }

//   async delete(entity: Customer): Promise<void> {
//     await this.entityManager.remove(entity);
//   }
// }
