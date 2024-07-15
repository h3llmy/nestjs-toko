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
} from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDiscountDto } from './dto/pagination-discount.dto';

@ApiTags('discounts')
@Controller('discounts')
export class DiscountsController {
  constructor(private readonly discountsService: DiscountsService) {}

  @Post()
  create(@Body() createDiscountDto: CreateDiscountDto) {
    return this.discountsService.create(createDiscountDto);
  }

  @Get()
  findAllPaginate(@Query() query: PaginationDiscountDto) {
    return this.discountsService.findAllPaginate(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const discount = await this.discountsService.findOne(id);

    if (!discount) {
      throw new NotFoundException(`Discount with id ${id} not found`);
    }

    return discount;
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDiscountDto: UpdateDiscountDto,
  ) {
    return this.discountsService.update(id, updateDiscountDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const discount = await this.discountsService.remove(id);

    if (discount.affected === 0) {
      throw new NotFoundException(`Discount with id ${id} not found`);
    }

    return { message: `Discount with id ${id} deleted` };
  }
}
