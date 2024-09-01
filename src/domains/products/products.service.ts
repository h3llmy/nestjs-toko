import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsRepository } from './products.repository';
import { PaginationProductDto } from './dto/pagination-product.dto';
import {
  IPaginationPayload,
  IPaginationResponse,
  ITransactionManager,
} from '@libs/database';
import { Product } from './entities/product.entity';
import {
  DeepPartial,
  FindManyOptions,
  FindOptionsRelations,
  ILike,
  SaveOptions,
  UpdateResult,
} from 'typeorm';
import { ProductCategoryService } from '@domains/product-category/product-category.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productRepository: ProductsRepository,
    private readonly productsCategoryService: ProductCategoryService,
  ) {}

  getProductWithDiscounts(
    productDiscounts: {
      productId: string;
      discountId?: string;
    }[],
  ) {
    return this.productRepository.getProductsWithDiscount(productDiscounts);
  }

  /**
   * Save a new product using the provided data.
   *
   * @param {CreateProductDto} createProductDto - The data to create the product.
   * @return {Promise<Product>} The saved product.
   */
  async create({
    images,
    quantity,
    ...createProductDto
  }: CreateProductDto): Promise<Product> {
    const productCategoryCheck = await this.productsCategoryService.findOne(
      createProductDto.categoryId,
    );

    if (!productCategoryCheck)
      throw new NotFoundException('Product category not found');

    const product: Product = await this.productRepository.save({
      ...createProductDto,
      inventory: {
        quantity,
      },
      images: images.map((image) => ({ url: image.save<string>() })),
      category: productCategoryCheck,
    });

    return product;
  }

  /**
   * Saves the given entity or array of entities to the database.
   *
   * @param {DeepPartial<Product> | DeepPartial<Product>[]} entity - The entity or array of entities to save.
   * @param {SaveOptions & ITransactionManager} [options] - Optional save options and transaction manager.
   * @return {Promise<DeepPartial<Product> | DeepPartial<Product>[]>} A promise that resolves to the saved entity or array of entities.
   */
  save(
    entity: DeepPartial<Product> | DeepPartial<Product>[],
    options?: SaveOptions & ITransactionManager,
  ): Promise<DeepPartial<Product> | DeepPartial<Product>[]> {
    return this.productRepository.saveEntity(entity, options);
  }

  /**
   * Finds multiple products based on the provided query.
   *
   * @param {any} findQuery - The query to find multiple products.
   * @return {Promise<Product[]>} A promise that resolves to an array of products.
   */
  findMany(findQuery?: FindManyOptions<Product>): Promise<Product[]> {
    return this.productRepository.find(findQuery);
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
        name: ILike(`%${search}%`),
      };
    }

    query.relations = {
      category: true,
      inventory: true,
      images: true,
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
        images: true,
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
