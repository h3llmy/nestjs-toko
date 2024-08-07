import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
  UseInterceptors,
  ParseUUIDPipe,
} from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { PaginationDiscountDto } from './dto/pagination-discount.dto';
import {
  BasicErrorSchema,
  BasicSuccessSchema,
  ErrorMessageSchema,
  paginationSchemaFactory,
  Permission,
  validationErrorSchemaFactory,
} from '@libs/common';
import { CreateDiscountErrorValidationDto } from './dto/create-discount-error-validation.dto';
import { DiscountDto } from './dto/discount.dto';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { Discount } from './entities/discount.entity';
import { DeepPartial } from 'typeorm';
import { IPaginationResponse } from '@libs/database';

@ApiTags('Discounts')
@Controller('discounts')
export class DiscountsController {
  constructor(private readonly discountsService: DiscountsService) {}

  @Post()
  @Permission('create discount')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new discount' })
  @ApiCreatedResponse({
    description: 'Discount created successfully',
    type: CreateDiscountDto,
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
    description: 'Unprocessable Entity',
    type: validationErrorSchemaFactory(CreateDiscountErrorValidationDto),
  })
  create(
    @Body() createDiscountDto: CreateDiscountDto,
  ): Promise<DeepPartial<Discount>> {
    return this.discountsService.create(createDiscountDto);
  }

  @Get()
  @Permission('get all discount')
  @ApiBearerAuth()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('get-all-discounts')
  @ApiOperation({ summary: 'Get all discount' })
  @ApiOkResponse({
    description: 'get all discount with pagination',
    type: paginationSchemaFactory(DiscountDto),
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many requests',
    type: ErrorMessageSchema,
  })
  findAllPaginate(
    @Query() query: PaginationDiscountDto,
  ): Promise<IPaginationResponse<Discount>> {
    return this.discountsService.findAllPaginate(query);
  }

  @Get(':id')
  @Permission('get discount by id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get discount by id' })
  @ApiOkResponse({
    description: 'get discount by id',
    type: DiscountDto,
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many requests',
    type: ErrorMessageSchema,
  })
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Discount> {
    const discount = await this.discountsService.findOne(id);

    if (!discount) {
      throw new NotFoundException(`Discount with id ${id} not found`);
    }

    return discount;
  }

  @Patch(':id')
  @Permission('update discount')
  @ApiOperation({ summary: 'Update discount by id' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Discount updated successfully',
    type: DiscountDto,
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many requests',
    type: ErrorMessageSchema,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: BasicErrorSchema,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Unprocessable Entity',
    type: validationErrorSchemaFactory(CreateDiscountErrorValidationDto),
  })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateDiscountDto: UpdateDiscountDto,
  ): Promise<DeepPartial<Discount>> {
    return this.discountsService.update(id, updateDiscountDto);
  }

  @Delete(':id')
  @Permission('delete discount')
  @ApiOperation({ summary: 'Delete discount by id' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Discount deleted successfully',
    type: BasicSuccessSchema,
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many requests',
    type: ErrorMessageSchema,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: BasicErrorSchema,
  })
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<BasicSuccessSchema> {
    const discount = await this.discountsService.remove(id);

    if (discount.affected === 0) {
      throw new NotFoundException(`Discount with id ${id} not found`);
    }

    return { message: `Discount with id ${id} deleted` };
  }
}
