import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import {
  BasicErrorSchema,
  BasicSuccessSchema,
  Permission,
  paginationSchemaFactory,
  validationErrorSchemaFactory,
} from '@libs/common';
import { ProductCategory } from './entities/product-category.entity';
import { PaginationProductCategoryDto } from './dto/pagination-product-category.dto';
import { DeepPartial } from 'typeorm';
import { ProductCategoryErrorValidationDto } from './dto/create-product-category-error-validation.dto';
import { ProductCategoryDto } from './dto/product-category.dto';
import { IPaginationResponse } from '@libs/database';

@ApiTags('Product Category')
@Controller('product-category')
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @Post()
  @Permission('create product category')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new product category' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: ProductCategoryDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: BasicErrorSchema,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Validation failed',
    type: validationErrorSchemaFactory(ProductCategoryErrorValidationDto),
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many requests',
    type: BasicErrorSchema,
  })
  create(
    @Body() createProductCategoryDto: CreateProductCategoryDto,
  ): Promise<DeepPartial<ProductCategory>> {
    return this.productCategoryService.create(createProductCategoryDto);
  }

  @Get()
  @Permission('get all product category')
  @ApiOperation({ summary: 'Get all product categories' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Get all product categories with pagination',
    type: paginationSchemaFactory(ProductCategoryDto),
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many requests',
    type: BasicErrorSchema,
  })
  findAllAndPaginate(
    @Query() findQuery: PaginationProductCategoryDto,
  ): Promise<IPaginationResponse<ProductCategory>> {
    return this.productCategoryService.findAllAndPaginate(findQuery);
  }

  @Get(':id')
  @Permission('get product category by id')
  @ApiOperation({ summary: 'Get product category by id' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Product Category id' })
  @ApiOkResponse({
    description: 'Get product category by id',
    type: ProductCategoryDto,
  })
  @ApiNotFoundResponse({
    description: 'Product Category not found',
    type: BasicErrorSchema,
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many requests',
    type: BasicErrorSchema,
  })
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ProductCategory> {
    const result = await this.productCategoryService.findOne(id);
    if (!result)
      throw new NotFoundException(`Product Category with id ${id} not found`);

    return result;
  }

  @Patch(':id')
  @Permission('update product category')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product category by id' })
  @ApiParam({ name: 'id', description: 'Product Category id' })
  @ApiOkResponse({
    description: 'Update product category by id',
    type: ProductCategoryDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: BasicErrorSchema,
  })
  @ApiNotFoundResponse({
    description: 'Product Category not found',
    type: BasicErrorSchema,
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many requests',
    type: BasicErrorSchema,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Validation failed',
    type: validationErrorSchemaFactory(ProductCategoryErrorValidationDto),
  })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateProductCategoryDto: UpdateProductCategoryDto,
  ): Promise<ProductCategory> {
    const result = await this.productCategoryService.update(
      id,
      updateProductCategoryDto,
    );
    if (!result)
      throw new NotFoundException(`Product Category with id ${id} not found`);

    return result;
  }

  @Delete(':id')
  @Permission('delete product category')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete product category by id' })
  @ApiParam({ name: 'id', description: 'Product Category id' })
  @ApiOkResponse({
    description: 'Delete product category by id',
    type: BasicSuccessSchema,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: BasicErrorSchema,
  })
  @ApiNotFoundResponse({
    description: 'Product Category not found',
    type: BasicErrorSchema,
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many requests',
    type: BasicErrorSchema,
  })
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<BasicSuccessSchema> {
    const result = await this.productCategoryService.remove(id);
    if (!result) {
      throw new NotFoundException(`Product Category with id ${id} not found`);
    }
    return { message: `Product Category with id ${id} has been deleted` };
  }
}
