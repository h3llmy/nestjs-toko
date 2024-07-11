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

  listenTo(): typeof ProductCategory {
    return ProductCategory;
  }

  async beforeInsert({ entity }: InsertEvent<ProductCategory>): Promise<void> {
    const productCategoryCheck = await this.productCategoryRepository.findOneBy(
      {
        name: entity.name,
      },
    );

    if (productCategoryCheck)
      throw new Error(`name ${entity.name} is already available`);
  }

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
