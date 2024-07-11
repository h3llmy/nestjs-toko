import { Injectable } from '@nestjs/common';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InventoriesRepository } from './inventories.repository';
import { Inventory } from './entities/inventory.entity';
import { DeepPartial, SaveOptions } from 'typeorm';
import { ITransactionManager } from '@app/common';

@Injectable()
export class InventoriesService {
  constructor(private readonly inventoriesRepository: InventoriesRepository) {}

  /**
   * Saves an entity with optional save options.
   *
   * @param {DeepPartial<Inventory>} data - The entity to save.
   * @param {SaveOptions & ITransactionManager} [options] - Optional save options.
   * @return {Promise<DeepPartial<Inventory>>} A promise that resolves with the saved entity.
   */
  saveEntity(
    data: DeepPartial<Inventory>,
    options?: SaveOptions & ITransactionManager,
  ): Promise<DeepPartial<Inventory>> {
    return this.inventoriesRepository.saveEntity(data, options);
  }

  /**
   * Find one inventory item by ID.
   *
   * @param {string} id - The ID of the inventory item to find.
   * @return {Promise<Inventory | null>} The found inventory item.
   */
  findOne(id: string): Promise<Inventory | null> {
    return this.inventoriesRepository.findOne({
      where: { id },
    });
  }

  /**
   * A description of the entire function.
   *
   * @param {string} id - The ID of the inventory item to update.
   * @param {UpdateInventoryDto} updateInventoryDto - The data to update the inventory with.
   * @return {Promise<Inventory>} A promise that resolves to the updated inventory item.
   */
  update(
    id: string,
    updateInventoryDto: UpdateInventoryDto,
    option?: ITransactionManager,
  ): Promise<Inventory> {
    return this.inventoriesRepository.updateAndFind(
      { id },
      updateInventoryDto,
      option,
    );
  }

  /**
   * Increments the quantity of an inventory item by 1.
   *
   * @param {string} id - The ID of the inventory item.
   * @return {Promise<Inventory>} - A promise that resolves to the updated quantity.
   */
  async addStock(
    id: string,
    quantity: number,
    option?: ITransactionManager,
  ): Promise<Inventory> {
    return this.inventoriesRepository.updateIncrement(
      { id },
      { quantity },
      option,
    );
  }

  /**
   * Decreases the quantity of an inventory item by the specified amount.
   *
   * @param {string} id - The ID of the inventory item.
   * @param {number} quantity - The amount by which to decrease the quantity.
   * @param {ITransactionManager} [option] - An optional transaction manager to use for the update.
   * @return {Promise<Inventory>} A promise that resolves to the updated inventory item.
   */
  async decreesStock(
    id: string,
    quantity: number,
    option?: ITransactionManager,
  ): Promise<Inventory> {
    return this.inventoriesRepository.updateDecrement(
      { id },
      { quantity },
      option,
    );
  }
}
