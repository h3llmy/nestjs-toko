import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  NotFoundException,
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
} from '@app/common';
import { Role } from '../users/entities/user.entity';
import { IncreaseStockDto } from './dto/increase-stock.dto';
import { Inventory } from './entities/inventory.entity';
import { InventoryDto } from './dto/inventory.dto';
import { InventoriesErrorValidationDto } from './dto/increase-stock-error-validation.dto';

@ApiTags('Inventories')
@Controller('inventories')
export class InventoriesController {
  constructor(private readonly inventoriesService: InventoriesService) {}

  @Get(':id')
  @Permission(Role.ADMIN)
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
  async findOne(@Param('id') id: string): Promise<Inventory> {
    const inventory = await this.inventoriesService.findOne(id);
    if (!inventory)
      throw new NotFoundException(`Inventory with id ${id} not found`);
    return inventory;
  }

  @Patch(':id')
  @Permission(Role.ADMIN)
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
    @Param('id') id: string,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ): Promise<Inventory> {
    const result = await this.inventoriesService.update(id, updateInventoryDto);
    if (!result)
      throw new NotFoundException(`Inventory with id ${id} not found`);
    return result;
  }

  @Patch('increase-stock/:id')
  @Permission(Role.ADMIN)
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
    @Param('id') id: string,
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
}
