import { DataSource, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { ProductCategory } from './product-category.entity';
import { ProductCategoryRepository } from '../product-category.repository';

@EventSubscriber()
export class ProductCategorySubscribers {
  constructor(
    private readonly dataSource: DataSource,
    private readonly productCategoryRepository: ProductCategoryRepository,
  ) {
    dataSource.subscribers.push(this);
  }

  /**
   * Returns the type of ProductCategory.
   *
   * @return {typeof ProductCategory} The type of ProductCategory.
   */
  listenTo(): typeof ProductCategory {
    return ProductCategory;
  }

  /**
   * Asynchronously checks if the name of the provided ProductCategory entity is already in use
   * before inserting the entity into the database.
   *
   * @param {InsertEvent<ProductCategory>} event - The event object containing the entity to be inserted.
   * @return {Promise<void>} A promise that resolves when the entity is successfully inserted.
   * @throws {Error} If the name of the provided ProductCategory entity is already in use.
   */
  async beforeInsert({ entity }: InsertEvent<ProductCategory>): Promise<void> {
    const productCategoryCheck = await this.productCategoryRepository.findOneBy(
      {
        name: entity.name,
      },
    );

    if (productCategoryCheck)
      throw new Error(`name ${entity.name} is already available`);
  }

  /**
   * Asynchronously checks if the name of the provided ProductCategory entity is already in use
   * before updating the entity in the database.
   *
   * @param {UpdateEvent<ProductCategory>} entity - The event object containing the entity to be updated.
   * @return {Promise<void>} A promise that resolves when the entity is successfully updated.
   */
  async beforeUpdate({ entity }: UpdateEvent<ProductCategory>): Promise<void> {
    const productCategoryCheck = await this.productCategoryRepository.findOneBy(
      {
        name: entity.name,
      },
    );

    if (productCategoryCheck && productCategoryCheck.id !== entity.id)
      throw new Error(`name ${entity.name} is already available`);
  }
}
