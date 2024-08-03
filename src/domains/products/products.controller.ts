import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  NotFoundException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
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
  ErrorMessageSchema,
  IPaginationResponse,
  Permission,
  paginationSchemaFactory,
  validationErrorSchemaFactory,
} from '@app/common';
import { ProductDto } from './dto/product.dto';
import { ProductErrorValidationDto } from './dto/create-product-error-validation.dto';
import { PaginationProductDto } from './dto/pagination-product.dto';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { Product } from './entities/product.entity';
import { ProductInventoryDto } from './dto/product-inventory.dto';

@Controller('products')
@ApiTags('Products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Permission('create product')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new product' })
  @ApiCreatedResponse({
    description: 'Product created successfully',
    type: ProductInventoryDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: BasicErrorSchema,
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many requests',
    type: ErrorMessageSchema,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Product validation error',
    type: validationErrorSchemaFactory(ProductErrorValidationDto),
  })
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @Permission('get all product')
  @ApiBearerAuth()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('get-all-products')
  @ApiOperation({ summary: 'Get all products' })
  @ApiOkResponse({
    description: 'get all products with pagination',
    type: paginationSchemaFactory(ProductDto),
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many requests',
    type: ErrorMessageSchema,
  })
  findAllPagination(
    @Query() findQuery: PaginationProductDto,
  ): Promise<IPaginationResponse<Product>> {
    return this.productsService.findAllPagination(findQuery);
  }

  @Get(':id')
  @Permission('get product by id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get product by id' })
  @ApiParam({ name: 'id', description: 'Product id' })
  @ApiOkResponse({
    description: 'Get product by id',
    type: ProductInventoryDto,
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many requests',
    type: ErrorMessageSchema,
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
    type: BasicErrorSchema,
  })
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Product> {
    const result = await this.productsService.findOne(id, {
      inventory: true,
    });
    if (!result) throw new NotFoundException(`Product with id ${id} not found`);
    return result;
  }

  @Patch(':id')
  @Permission('update product')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product by id' })
  @ApiParam({ name: 'id', description: 'Product id' })
  @ApiOkResponse({
    description: 'Update product by id',
    type: ProductDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: BasicErrorSchema,
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
    type: BasicErrorSchema,
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many requests',
    type: ErrorMessageSchema,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Product validation error',
    type: validationErrorSchemaFactory(ProductErrorValidationDto),
  })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const result = await this.productsService.update(id, updateProductDto);
    if (!result) throw new NotFoundException(`Product with id ${id} not found`);
    return result;
  }

  @Delete(':id')
  @Permission('delete product')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete product by id' })
  @ApiParam({ name: 'id', description: 'Product id' })
  @ApiOkResponse({
    description: 'Delete product by id',
    type: BasicSuccessSchema,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: BasicErrorSchema,
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
    type: BasicErrorSchema,
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many requests',
    type: ErrorMessageSchema,
  })
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<BasicSuccessSchema> {
    await this.productsService.remove(id);
    return { message: `user with id ${id} has been deleted` };
  }
}
