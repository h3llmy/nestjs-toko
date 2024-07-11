import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { DefaultRepository } from '@app/common';
import { Repository } from 'typeorm';

export class InventoriesRepository extends DefaultRepository<Inventory> {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
  ) {
    super(
      inventoryRepository.target,
      inventoryRepository.manager,
      inventoryRepository.queryRunner,
    );
  }
}
