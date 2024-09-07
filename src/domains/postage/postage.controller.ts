import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { PostageService } from './postage.service';
import { PostageProvinceDto } from './dto/province.dto';
import { CityDto } from './dto/city.dto';
import { CheckPriceCostDto } from './dto/check-price-cost.dto';
import { PriceCostDto } from './dto/price-cost.dto';
import {
  BasicErrorSchema,
  Permission,
  validationErrorSchemaFactory,
} from '@libs/common';
import { CheckPriceCostErrorValidationDto } from './dto/check-price-cost-error-validation.dto';

@ApiTags('Postage')
@Controller('postage')
export class PostageController {
  constructor(private readonly postageService: PostageService) {}

  @Get('provinces')
  @Permission('get all provinces')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all provinces' })
  @ApiOkResponse({
    type: PostageProvinceDto,
    isArray: true,
    description: 'Get all provinces',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: BasicErrorSchema,
  })
  @ApiTooManyRequestsResponse({
    type: BasicErrorSchema,
    description: 'Too many requests',
  })
  async getAllProvinces(): Promise<PostageProvinceDto[]> {
    return this.postageService.getAllProvinces();
  }

  @Get('city/:provinceId')
  @Permission('get all cities')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all cities' })
  @ApiOkResponse({
    type: CityDto,
    isArray: true,
    description: 'Get all cities',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: BasicErrorSchema,
  })
  @ApiTooManyRequestsResponse({
    type: BasicErrorSchema,
    description: 'Too many requests',
  })
  async getAllCities(
    @Param('provinceId') provinceId: string,
  ): Promise<CityDto[]> {
    return this.postageService.getAllCities(provinceId);
  }

  @Get('price')
  @Permission('get price')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get price' })
  @ApiOkResponse({
    type: PriceCostDto,
    description: 'Get price',
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: BasicErrorSchema,
  })
  @ApiUnprocessableEntityResponse({
    type: validationErrorSchemaFactory(CheckPriceCostErrorValidationDto),
    description: 'price cost validation error',
  })
  @ApiTooManyRequestsResponse({
    type: BasicErrorSchema,
    description: 'Too many requests',
  })
  async getPrice(
    @Query() checkPriceCost: CheckPriceCostDto,
  ): Promise<PriceCostDto> {
    return this.postageService.getPrice(checkPriceCost);
  }
}
