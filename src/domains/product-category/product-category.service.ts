import { Injectable } from '@nestjs/common';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { ProductCategoryRepository } from './product-category.repository';
import { DeepPartial, ILike, UpdateResult } from 'typeorm';
import { ProductCategory } from './entities/product-category.entity';
import { IPaginationPayload, IPaginationResponse } from '@app/common';
import { PaginationProductCategoryDto } from './dto/pagination-product-category.dto';

@Injectable()
export class ProductCategoryService {
  constructor(
    private readonly productCategoryRepository: ProductCategoryRepository,
  ) {}

  /**
   * Creates a new product category using the provided DTO.
   *
   * @param {CreateProductCategoryDto} createProductCategoryDto - The DTO containing the data for the new product category.
   * @return {Promise<DeepPartial<ProductCategory>>} A promise that resolves to the created product category.
   */
  create(
    createProductCategoryDto: CreateProductCategoryDto,
  ): Promise<DeepPartial<ProductCategory>> {
    return this.productCategoryRepository.saveEntity(createProductCategoryDto);
  }

  /**
   * Retrieves a paginated list of product categories based on the provided search query.
   *
   * @param {PaginationProductCategoryDto} findQuery - The search query for pagination.
   * @return {Promise<IPaginationResponse<ProductCategory>>} A promise that resolves to the paginated response containing the product categories.
   */
  findAllAndPaginate(
    findQuery: PaginationProductCategoryDto,
  ): Promise<IPaginationResponse<ProductCategory>> {
    const { search, ...paginationQuery } = findQuery;
    const query: IPaginationPayload<ProductCategory> = {
      ...paginationQuery,
    };

    if (search) {
      query.where = {
        name: ILike(`%${search}%`),
      };
    }
    return this.productCategoryRepository.findPagination(query);
  }

  /**
   * Finds a product category by its ID.
   *
   * @param {string} id - The ID of the product category to find.
   * @return {Promise<ProductCategory | null>} A promise that resolves to the found product category, or null if not found.
   */
  findOne(id: string): Promise<ProductCategory | null> {
    return this.productCategoryRepository.findOne({ where: { id } });
  }

  /**
   * Updates a product category by its ID.
   *
   * @param {string} id - The ID of the product category to update.
   * @param {UpdateProductCategoryDto} updateProductCategoryDto - The data to update the product category with.
   * @return {Promise<ProductCategory>} A promise that resolves to the updated product category.
   */
  update(
    id: string,
    updateProductCategoryDto: UpdateProductCategoryDto,
  ): Promise<ProductCategory> {
    return this.productCategoryRepository.updateAndFind(
      { id },
      updateProductCategoryDto,
    );
  }

  /**
   * Removes a product category by its ID.
   *
   * @param {string} id - The ID of the product category to remove.
   * @return {Promise<UpdateResult>} A promise that resolves to the update result.
   */
  remove(id: string): Promise<UpdateResult> {
    return this.productCategoryRepository.softDelete({ id });
  }
}
