import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { DiscountsRepository } from './discounts.repository';
import {
  DeepPartial,
  FindOptionsRelations,
  ILike,
  In,
  UpdateResult,
} from 'typeorm';
import { IPaginationPayload, IPaginationResponse } from '@app/common';
import { Discount } from './entities/discount.entity';
import { ProductsService } from '../products/products.service';
import { PaginationDiscountDto } from './dto/pagination-discount.dto';

@Injectable()
export class DiscountsService {
  constructor(
    private readonly discountsRepository: DiscountsRepository,
    private readonly productsService: ProductsService,
  ) {}

  /**
   * Creates a new discount using the provided DTO.
   *
   * @param {CreateDiscountDto} createDiscountDto - The DTO containing the data for the new discount.
   * @return {Promise<DeepPartial<Discount>>} A promise that resolves to the created discount.
   */
  async create(
    createDiscountDto: CreateDiscountDto,
  ): Promise<DeepPartial<Discount>> {
    const { productId, ...discountDto } = createDiscountDto;
    const products = await this.productsService.findMany({
      where: { id: In(productId) },
    });
    if (productId.length !== products.length) {
      const notFoundProducts = productId.filter(
        (id) => !products.find((product) => product.id === id),
      );
      throw new NotFoundException(
        `Product with id ${notFoundProducts.join(', ')} not found`,
      );
    }
    return this.discountsRepository.saveEntity({ ...discountDto, products });
  }

  /**
   * Retrieves a paginated list of discounts based on the provided search query.
   *
   * @param {PaginationDiscountDto} findQuery - The search query for pagination.
   * @return {Promise<IPaginationResponse<Discount>>} A promise that resolves to the paginated response containing the discounts.
   */
  findAllPaginate(
    findQuery: PaginationDiscountDto,
  ): Promise<IPaginationResponse<Discount>> {
    const { search, ...paginationQuery } = findQuery;
    const query: IPaginationPayload<Discount> = {
      ...paginationQuery,
    };
    if (search) {
      query.where = {
        name: ILike(search),
      };
    }
    query.relations = {
      products: {
        category: true,
      },
    };
    return this.discountsRepository.findPagination(query);
  }

  /**
   * Finds a single discount by its ID.
   *
   * @param {string} id - The ID of the discount to find.
   * @param {FindOptionsRelations<Discount>} [relations] - Optional relations to include in the result.
   * @return {Promise<Discount | null>} A promise that resolves to the found discount, or null if not found.
   */
  findOne(
    id: string,
    relations?: FindOptionsRelations<Discount>,
  ): Promise<Discount | null> {
    return this.discountsRepository.findOne({ where: { id }, relations });
  }

  /**
   * Updates a discount based on the provided ID and DTO.
   *
   * @param {string} id - The ID of the discount to update.
   * @param {UpdateDiscountDto} updateDiscountDto - The DTO containing the updated data.
   * @return {Promise<Discount | null>} A promise that resolves to the updated discount or null if not found.
   */
  async update(
    id: string,
    updateDiscountDto: UpdateDiscountDto,
  ): Promise<DeepPartial<Discount>> {
    const { productId, ...discountDto } = updateDiscountDto;
    const products = await this.productsService.findMany({
      where: { id: In(productId) },
    });
    if (productId.length !== products.length) {
      const notFoundProducts = productId.filter(
        (id) => !products.find((product) => product.id === id),
      );
      throw new NotFoundException(
        `Product with id ${notFoundProducts.join(', ')} not found`,
      );
    }

    return this.discountsRepository.saveEntity({
      id,
      ...discountDto,
      products,
    });
  }

  /**
   * Removes a discount by its ID.
   *
   * @param {string} id - The ID of the discount to remove.
   * @return {Promise<UpdateResult>} A promise that resolves to the update result.
   */
  remove(id: string): Promise<UpdateResult> {
    return this.discountsRepository.softDelete(id);
  }
}
