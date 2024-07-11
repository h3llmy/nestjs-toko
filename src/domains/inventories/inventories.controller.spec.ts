import { TestBed } from '@automock/jest';
import { InventoriesController } from './inventories.controller';
import { InventoriesService } from './inventories.service';
import { Inventory } from './entities/inventory.entity';
import { Product } from '../products/entities/product.entity';
import { NotFoundException } from '@nestjs/common';

describe('InventoriesController', () => {
  let controller: InventoriesController;
  let inventoriesService: jest.Mocked<InventoriesService>;

  const productMock: Product = {
    id: '1',
    description: 'test',
    name: 'test',
    price: 100000,
    deletedAt: null,
    updatedAt: new Date(),
    createdAt: new Date(),
  };

  const inventortorysMock: Inventory = {
    id: '1',
    product: productMock,
    quantity: 10,
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.create(
      InventoriesController,
    ).compile();

    controller = unit;
    inventoriesService = unitRef.get<InventoriesService>(InventoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(inventoriesService).toBeDefined();
  });

  describe('findOne', () => {
    it('should be defined', () => {
      expect(controller.findOne).toBeDefined();
    });
    it('should get a inventory by id', async () => {
      inventoriesService.findOne.mockResolvedValue(inventortorysMock);
      const result = await controller.findOne('1');
      expect(result).toEqual(inventortorysMock);
      expect(inventoriesService.findOne).toHaveBeenCalledWith('1');
    });
    it('should throw NotFoundException when inventory not found', async () => {
      inventoriesService.findOne.mockResolvedValue(null);
      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
      expect(inventoriesService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should be defined', () => {
      expect(controller.update).toBeDefined();
    });
    it('should update inventory', async () => {
      inventoriesService.update.mockResolvedValue(inventortorysMock);
      expect(await controller.update('1', { quantity: 100 })).toEqual(
        inventortorysMock,
      );
    });
    it('should throw NotFoundException when inventory not found', async () => {
      inventoriesService.update.mockResolvedValue(null);
      await expect(controller.update('1', { quantity: 100 })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('increaseStock', () => {
    it('should be defined', () => {
      expect(controller.increaseStock).toBeDefined();
    });
    it('should increase inventory stock', async () => {
      inventoriesService.addStock.mockResolvedValue(inventortorysMock);
      expect(await controller.increaseStock('1', { quantity: 100 })).toEqual(
        inventortorysMock,
      );
    });
    it('should throw NotFoundException when inventory not found', async () => {
      inventoriesService.addStock.mockResolvedValue(null);
      await expect(
        controller.increaseStock('1', { quantity: 100 }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
