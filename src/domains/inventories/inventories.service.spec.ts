import { TestBed } from '@automock/jest';
import { InventoriesService } from './inventories.service';
import { InventoriesRepository } from './inventories.repository';
import { DeepPartial, QueryRunner } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

describe('InventoriesService', () => {
  let inventoriesService: InventoriesService;
  let inventoriesRepository: jest.Mocked<InventoriesRepository>;
  let queryRunner: jest.Mocked<QueryRunner>;

  const updatedAt = new Date();

  const inventoriesMock: Inventory = {
    id: '1',
    product: {
      id: '1',
      description: 'test',
      name: 'test',
      price: 100000,
      deletedAt: null,
      updatedAt: new Date(),
      createdAt: new Date(),
    },
    quantity: 10,
    updatedAt,
  };

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(InventoriesService).compile();

    inventoriesService = unit;
    inventoriesRepository = unitRef.get(InventoriesRepository);

    // Mock QueryRunner
    queryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        getRepository: jest.fn(),
      },
    } as unknown as jest.Mocked<QueryRunner>;
  });

  it('should be defined', () => {
    expect(inventoriesService).toBeDefined();
    expect(inventoriesRepository).toBeDefined();
  });

  describe('saveEntity', () => {
    it('should save an entity', async () => {
      const createInventoriesMock: DeepPartial<Inventory> = {
        product: {
          id: '1',
          description: 'test',
          name: 'test',
          price: 100000,
        },
        quantity: 10,
        updatedAt,
      };
      inventoriesRepository.saveEntity.mockResolvedValue(inventoriesMock);

      const result = await inventoriesService.saveEntity(createInventoriesMock);

      expect(result).toEqual(inventoriesMock);
      expect(inventoriesRepository.saveEntity).toHaveBeenCalledWith(
        createInventoriesMock,
        undefined,
      );
    });

    it('should save an entity with options', async () => {
      const createInventoriesMock: DeepPartial<Inventory> = {
        product: {
          id: '1',
          description: 'test',
          name: 'test',
          price: 100000,
        },
        quantity: 10,
        updatedAt,
      };

      inventoriesRepository.saveEntity.mockResolvedValue(inventoriesMock);

      const result = await inventoriesService.saveEntity(
        createInventoriesMock,
        {
          session: queryRunner,
        },
      );

      expect(result).toEqual(inventoriesMock);
      expect(inventoriesRepository.saveEntity).toHaveBeenCalledWith(
        createInventoriesMock,
        {
          session: queryRunner,
        },
      );
    });
  });

  describe('findOne', () => {
    it('should get an inventory by id', async () => {
      inventoriesRepository.findOne.mockResolvedValue(inventoriesMock);

      const result = await inventoriesService.findOne('1');

      expect(result).toEqual(inventoriesMock);
      expect(inventoriesRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('update', () => {
    it('should update an inventory', async () => {
      const updateInventoriesMock: UpdateInventoryDto = {
        quantity: 10,
      };
      inventoriesRepository.updateAndFind.mockResolvedValue(inventoriesMock);

      const result = await inventoriesService.update(
        '1',
        updateInventoriesMock,
      );

      expect(result).toEqual(inventoriesMock);
      expect(inventoriesRepository.updateAndFind).toHaveBeenCalledWith(
        {
          id: '1',
        },
        updateInventoriesMock,
        undefined,
      );
    });

    it('should update an inventory with options', async () => {
      const updateInventoriesMock: UpdateInventoryDto = {
        quantity: 10,
      };

      inventoriesRepository.updateAndFind.mockResolvedValue(inventoriesMock);

      const result = await inventoriesService.update(
        '1',
        updateInventoriesMock,
        {
          session: queryRunner,
        },
      );

      expect(result).toEqual(inventoriesMock);
      expect(inventoriesRepository.updateAndFind).toHaveBeenCalledWith(
        {
          id: '1',
        },
        updateInventoriesMock,
        {
          session: queryRunner,
        },
      );
    });
  });

  describe('addStock', () => {
    it('should add stock to an inventory', async () => {
      inventoriesRepository.updateIncrement.mockResolvedValue(inventoriesMock);

      const result = await inventoriesService.addStock('1', 10);

      expect(result).toEqual(inventoriesMock);
      expect(inventoriesRepository.updateIncrement).toHaveBeenCalledWith(
        {
          id: '1',
        },
        {
          quantity: 10,
        },
        undefined,
      );
    });

    it('should add stock to an inventory with options', async () => {
      inventoriesRepository.updateIncrement.mockResolvedValue(inventoriesMock);

      const result = await inventoriesService.addStock('1', 10, {
        session: queryRunner,
      });

      expect(result).toEqual(inventoriesMock);
      expect(inventoriesRepository.updateIncrement).toHaveBeenCalledWith(
        {
          id: '1',
        },
        {
          quantity: 10,
        },
        {
          session: queryRunner,
        },
      );
    });
  });

  describe('decreesStock', () => {
    it('should decrees stock to an inventory', async () => {
      inventoriesRepository.updateDecrement.mockResolvedValue(inventoriesMock);

      const result = await inventoriesService.decreesStock('1', 10);

      expect(result).toEqual(inventoriesMock);
      expect(inventoriesRepository.updateDecrement).toHaveBeenCalledWith(
        {
          id: '1',
        },
        {
          quantity: 10,
        },
        undefined,
      );
    });

    it('should decrees stock to an inventory with options', async () => {
      inventoriesRepository.updateDecrement.mockResolvedValue(inventoriesMock);

      const result = await inventoriesService.decreesStock('1', 10, {
        session: queryRunner,
      });

      expect(result).toEqual(inventoriesMock);
      expect(inventoriesRepository.updateDecrement).toHaveBeenCalledWith(
        {
          id: '1',
        },
        {
          quantity: 10,
        },
        {
          session: queryRunner,
        },
      );
    });
  });
});
