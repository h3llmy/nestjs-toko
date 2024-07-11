import { Module } from '@nestjs/common';
import { InventoriesService } from './inventories.service';
import { InventoriesController } from './inventories.controller';
import { InventoriesRepository } from './inventories.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory])],
  controllers: [InventoriesController],
  providers: [InventoriesService, InventoriesRepository],
  exports: [InventoriesService],
})
export class InventoriesModule {}
