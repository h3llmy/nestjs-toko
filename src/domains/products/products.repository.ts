import { DefaultRepository } from '@libs/database';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class ProductsRepository extends DefaultRepository<Product> {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {
    super(
      productRepository.target,
      productRepository.manager,
      productRepository.queryRunner,
    );
  }

  /**
   * Retrieves products with discounts based on the provided product discounts.
   *
   * @param {Array<{ productId: string; discountId?: string }>} productDiscounts - An array of objects containing product IDs and optional discount IDs.
   * @return {Promise<Product[]>} A promise that resolves to an array of products with discounts.
   */
  async getProductsWithDiscount(
    productDiscounts: { productId: string; discountId?: string }[],
  ): Promise<Product[]> {
    const productsWithDiscounts = productDiscounts.filter(
      (pd) => pd.discountId,
    );

    const uniqueProductIdsWithDiscounts = [
      ...new Set(productsWithDiscounts.map((pd) => pd.productId)),
    ];
    const uniqueDiscountIds = [
      ...new Set(productsWithDiscounts.map((pd) => pd.discountId)),
    ];

    const queryBuilder = this.createQueryBuilder('product')
      .leftJoinAndSelect('product.inventory', 'inventory')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.discounts', 'discount');

    if (uniqueProductIdsWithDiscounts.length > 0) {
      queryBuilder
        .where('product.id IN (:...uniqueProductIdsWithDiscounts)', {
          uniqueProductIdsWithDiscounts,
        })
        .andWhere('discount.id IN (:...uniqueDiscountIds)', {
          uniqueDiscountIds,
        });
    }

    const products = await queryBuilder.getMany();

    return products;
  }
}
