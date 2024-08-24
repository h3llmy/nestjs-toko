import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  NotFoundException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { InventoriesService } from './inventories.service';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import {
  ApiBearerAuth,
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
  Permission,
  validationErrorSchemaFactory,
} from '@libs/common';
import { IncreaseStockDto } from './dto/increase-stock.dto';
import { Inventory } from './entities/inventory.entity';
import { InventoryDto } from './dto/inventory.dto';
import { InventoriesErrorValidationDto } from './dto/increase-stock-error-validation.dto';
import { DecreaseStockDto } from './dto/decrees-stock.dto';

@ApiTags('Inventories')
@Controller('inventories')
export class InventoriesController {
  constructor(private readonly inventoriesService: InventoriesService) {}

  @Get(':id')
  @Permission('get inventories by id')
  @ApiOperation({ summary: 'Get inventory by id' })
  @ApiParam({ name: 'id', description: 'Inventory id' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Get inventory by id',
    type: InventoryDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: BasicErrorSchema,
  })
  @ApiNotFoundResponse({
    description: 'Inventory not found',
    type: BasicErrorSchema,
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many requests',
    type: BasicErrorSchema,
  })
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Inventory> {
    const inventory = await this.inventoriesService.findOne(id);
    if (!inventory)
      throw new NotFoundException(`Inventory with id ${id} not found`);
    return inventory;
  }

  @Patch(':id')
  @Permission('update inventories')
  @ApiOperation({ summary: 'Update inventory by id' })
  @ApiParam({ name: 'id', description: 'Inventory id' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Update inventory by id',
    type: InventoryDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: BasicErrorSchema,
  })
  @ApiNotFoundResponse({
    description: 'Inventory not found',
    type: BasicErrorSchema,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Unprocessable entity',
    type: validationErrorSchemaFactory(InventoriesErrorValidationDto),
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many requests',
    type: BasicErrorSchema,
  })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ): Promise<Inventory> {
    const result = await this.inventoriesService.update(id, updateInventoryDto);
    if (!result)
      throw new NotFoundException(`Inventory with id ${id} not found`);
    return result;
  }

  @Patch('increase-stock/:id')
  @Permission('increase inventory stock by id')
  @ApiOperation({ summary: 'Increase inventory stock by id' })
  @ApiParam({ name: 'id', description: 'Inventory id' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Increase inventory stock by id',
    type: InventoryDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: BasicErrorSchema,
  })
  @ApiNotFoundResponse({
    description: 'Inventory not found',
    type: BasicErrorSchema,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Unprocessable entity',
    type: validationErrorSchemaFactory(InventoriesErrorValidationDto),
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many requests',
    type: BasicErrorSchema,
  })
  async increaseStock(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() increaseStockDto: IncreaseStockDto,
  ): Promise<Inventory> {
    const updatedStock = await this.inventoriesService.addStock(
      id,
      increaseStockDto.quantity,
    );
    if (!updatedStock)
      throw new NotFoundException(`Inventory with id ${id} not found`);
    return updatedStock;
  }

  @Patch('decrease-stock/:id')
  @Permission('decree inventory stock by id')
  @ApiOperation({ summary: 'decrease inventory stock by id' })
  @ApiParam({ name: 'id', description: 'Inventory id' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'decrease inventory stock by id',
    type: InventoryDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: BasicErrorSchema,
  })
  @ApiNotFoundResponse({
    description: 'Inventory not found',
    type: BasicErrorSchema,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Unprocessable entity',
    type: validationErrorSchemaFactory(InventoriesErrorValidationDto),
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many requests',
    type: BasicErrorSchema,
  })
  async decreaseStock(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() increaseStockDto: DecreaseStockDto,
  ): Promise<Inventory> {
    const updatedStock = await this.inventoriesService.decreesStock(
      id,
      increaseStockDto.quantity,
    );
    if (!updatedStock)
      throw new NotFoundException(`Inventory with id ${id} not found`);
    return updatedStock;
  }
}
