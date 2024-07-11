import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsRepository } from './products.repository';
import { PaginationProductDto } from './dto/pagination-product.dto';
import { IPaginationPayload, IPaginationResponse } from '@app/common';
import { Product } from './entities/product.entity';
import { DataSource, FindOptionsRelations, ILike, UpdateResult } from 'typeorm';
import { InventoriesService } from '../inventories/inventories.service';
import { ProductCategoryService } from '../product-category/product-category.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productRepository: ProductsRepository,
    private readonly productsCategoryService: ProductCategoryService,
    private readonly inventoryService: InventoriesService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Save a new product using the provided data.
   *
   * @param {CreateProductDto} createProductDto - The data to create the product.
   * @return {Promise<Product>} The saved product.
   */
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const productCategoryCheck = await this.productsCategoryService.findOne(
        createProductDto.categoryId,
      );

      if (!productCategoryCheck)
        throw new NotFoundException('Product category not found');

      const product = await this.productRepository.saveEntity(
        { ...createProductDto, category: productCategoryCheck },
        { session: queryRunner },
      );

      await this.inventoryService.saveEntity(
        {
          quantity: createProductDto.quantity,
          product: product,
        },
        { session: queryRunner },
      );

      await queryRunner.commitTransaction();
      return await this.productRepository.findOne({
        where: { id: product.id },
        relations: ['inventory', 'category'],
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Retrieves a paginated list of products based on the provided query.
   *
   * @param {PaginationProductDto} findQuery - The query parameters for pagination.
   * @return {Promise<IPaginationResponse<Product>>} A paginated response containing products.
   */
  findAllPagination(
    findQuery: PaginationProductDto,
  ): Promise<IPaginationResponse<Product>> {
    const { search, ...paginationQuery } = findQuery;
    const query: IPaginationPayload<Product> = {
      ...paginationQuery,
    };
    if (search) {
      query.where = {
        name: ILike(search),
      };
    }

    query.relations = {
      category: true,
      inventory: true,
    };

    return this.productRepository.findPagination(query);
  }

  /**
   * Finds a product by its ID.
   *
   * @param {string} id - The ID of the product to find.
   * @param {FindOptionsRelations<Product>} [relations] - The relations to include in the result.
   * @return {Promise<Product | null>} A promise that resolves to the found product.
   */
  findOne(
    id: string,
    relations?: FindOptionsRelations<Product>,
  ): Promise<Product | null> {
    return this.productRepository.findOne({
      where: { id },
      relations: relations,
    });
  }

  /**
   * Updates a product with the given ID using the provided update data.
   *
   * @param {string} id - The ID of the product to update.
   * @param {UpdateProductDto} updateProductDto - The data to update the product with.
   * @return {Promise<Product>} A promise that resolves to the updated product.
   */
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const { categoryId, ...updateData } = updateProductDto;

    if (categoryId) {
      const productCategoryCheck =
        await this.productsCategoryService.findOne(categoryId);

      if (!productCategoryCheck) {
        throw new NotFoundException('Product category not found');
      }

      (updateData as Partial<Product>).category = productCategoryCheck;
    }

    return this.productRepository.updateAndFind({ id }, updateData, {
      relations: {
        inventory: true,
        category: true,
      },
    });
  }

  /**
   * Asynchronously removes a product by ID.
   *
   * @param {string} id - The ID of the product to remove.
   * @return {Promise<UpdateResult>} A promise that resolves to the update result.
   */
  async remove(id: string): Promise<UpdateResult> {
    const result = await this.productRepository.softDelete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Product ${id} not found`);
    return result;
  }
}
