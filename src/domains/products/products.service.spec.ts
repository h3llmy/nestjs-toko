import { TestBed } from '@automock/jest';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';
import { Product } from './entities/product.entity';
import { IPaginationResponse } from '@libs/database';
import { NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { DataSource, QueryRunner } from 'typeorm';
import { Inventory } from '@domains/inventories/entities/inventory.entity';
import { InventoriesService } from '@domains/inventories/inventories.service';
import { ProductCategory } from '@domains/product-category/entities/product-category.entity';
import { ProductCategoryService } from '@domains/product-category/product-category.service';
import { UpdateProductDto } from './dto/update-product.dto';

describe('ProductsService', () => {
  let service: ProductsService;
  let productsRepository: jest.Mocked<ProductsRepository>;
  let dataSource: jest.Mocked<DataSource>;
  let queryRunner: jest.Mocked<QueryRunner>;
  let inventoryServices: jest.Mocked<InventoriesService>;
  let productCategoryService: jest.Mocked<ProductCategoryService>;

  const mockInventory: Inventory = {
    id: 'ddeb70d1-034a-412e-bbcc-5a723572383a',
    quantity: 10,
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockCategory: ProductCategory = {
    id: '1',
    name: 'category 1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockProductInventory: Product = {
    id: '1',
    name: 'Test Product',
    price: 10,
    description: 'Test Product',
    deletedAt: null,
    inventory: mockInventory,
    category: mockCategory,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    price: 10,
    description: 'Test Product',
    deletedAt: null,
    inventory: mockInventory,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockProductsPagination: IPaginationResponse<Product> = {
    totalData: 1,
    totalPages: 1,
    page: 1,
    limit: 10,
    data: [mockProductInventory],
  };

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(ProductsService).compile();

    service = unit;
    productsRepository = unitRef.get(ProductsRepository);
    inventoryServices = unitRef.get(InventoriesService);
    dataSource = unitRef.get(DataSource);
    productCategoryService = unitRef.get(ProductCategoryService);

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

    dataSource.createQueryRunner = jest.fn().mockReturnValue(queryRunner);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(productsRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create new product', async () => {
      const mockCreateProduct: CreateProductDto = {
        name: 'Test Product',
        price: 10,
        description: 'Test Product',
        quantity: 10,
        categoryId: '1',
      };

      productsRepository.saveEntity.mockResolvedValueOnce({
        ...mockCreateProduct,
        id: '1',
      });
      productCategoryService.findOne.mockResolvedValue(mockCategory);
      productsRepository.findOne.mockResolvedValueOnce(mockProductInventory);

      const result = await service.create(mockCreateProduct);

      expect(dataSource.createQueryRunner).toHaveBeenCalledTimes(1);
      expect(queryRunner.startTransaction).toHaveBeenCalledTimes(1);
      expect(productsRepository.saveEntity).toHaveBeenCalledWith(
        {
          ...mockCreateProduct,
          category: {
            ...mockCategory,
            id: '1',
          },
        },
        {
          session: queryRunner,
        },
      );
      expect(productCategoryService.findOne).toHaveBeenCalledWith('1');
      expect(productsRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: {
          inventory: true,
          category: true,
        },
      });
      expect(inventoryServices.saveEntity).toHaveBeenCalledWith(
        {
          quantity: mockCreateProduct.quantity,
          product: {
            ...mockCreateProduct,
            id: '1',
          },
        },
        {
          session: queryRunner,
        },
      );
      expect(queryRunner.commitTransaction).toHaveBeenCalledTimes(1);
      expect(queryRunner.release).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockProductInventory);
    });

    it('should rollback transaction on category not found', async () => {
      const mockCreateProduct: CreateProductDto = {
        name: 'Test Product',
        price: 10,
        description: 'Test Product',
        quantity: 10,
        categoryId: '1',
      };

      productCategoryService.findOne.mockRejectedValue(
        new NotFoundException('Product category not found'),
      );

      await expect(service.create(mockCreateProduct)).rejects.toThrow(
        NotFoundException,
      );

      expect(productsRepository.saveEntity).not.toHaveBeenCalled();
      expect(inventoryServices.saveEntity).not.toHaveBeenCalled();
      expect(queryRunner.commitTransaction).not.toHaveBeenCalled();
      expect(productCategoryService.findOne).toHaveBeenCalledWith('1');
      expect(queryRunner.rollbackTransaction).toHaveBeenCalledTimes(1);
      expect(queryRunner.release).toHaveBeenCalledTimes(1);
    });
    it('should rollback transaction on error', async () => {
      const mockCreateProduct: CreateProductDto = {
        name: 'Test Product',
        price: 10,
        description: 'Test Product',
        quantity: 10,
        categoryId: '1',
      };

      productCategoryService.findOne.mockResolvedValue(mockCategory);

      productsRepository.saveEntity.mockRejectedValue(
        new Error('Create error'),
      );

      await expect(service.create(mockCreateProduct)).rejects.toThrow(
        'Create error',
      );

      expect(inventoryServices.saveEntity).not.toHaveBeenCalled();
      expect(queryRunner.commitTransaction).not.toHaveBeenCalled();
      expect(productCategoryService.findOne).toHaveBeenCalledWith('1');
      expect(queryRunner.rollbackTransaction).toHaveBeenCalledTimes(1);
      expect(queryRunner.release).toHaveBeenCalledTimes(1);
    });
  });

  describe('save', () => {
    it('should save product', async () => {
      productsRepository.saveEntity.mockResolvedValueOnce(mockProduct);
      const result = await service.save(mockProduct);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('findMany', () => {
    it('should get list products', async () => {
      productsRepository.find.mockResolvedValue([mockProduct]);
      const products = await service.findMany();
      expect(productsRepository.find).toHaveBeenCalled();
      expect(products).toEqual([mockProduct]);
    });
  });

  describe('findAllPagination', () => {
    it('should get list products with pagination', async () => {
      productsRepository.findPagination.mockResolvedValue(
        mockProductsPagination,
      );
      const paginationOption = {
        page: 1,
        limit: 10,
      };
      const products = await service.findAllPagination(paginationOption);
      expect(productsRepository.findPagination).toHaveBeenCalledWith({
        ...paginationOption,
        relations: {
          category: true,
          inventory: true,
        },
      });
      expect(products).toEqual(mockProductsPagination);
    });
  });

  describe('findOne', () => {
    it('should get product by id', async () => {
      productsRepository.findOne.mockResolvedValue(mockProduct);
      const product = await service.findOne(mockProduct.id);
      expect(productsRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockProduct.id },
      });
      expect(product).toEqual(mockProduct);
    });

    it('should get product with inventory by id', async () => {
      productsRepository.findOne.mockResolvedValue(mockProduct);
      const product = await service.findOne(mockProduct.id, {
        inventory: true,
      });

      expect(productsRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockProduct.id },
        relations: { inventory: true },
      });
      expect(product).toEqual(mockProduct);
    });
  });

  describe('update', () => {
    it('should update product', async () => {
      const mockUpdateProduct: UpdateProductDto = {
        name: 'Test Product',
        price: 10,
        categoryId: '1',
        description: 'Test Product',
      };

      productCategoryService.findOne.mockResolvedValue(mockCategory);
      productsRepository.updateAndFind.mockResolvedValue(mockProduct);

      expect(await service.update(mockProduct.id, mockUpdateProduct)).toEqual(
        mockProduct,
      );
    });
  });

  describe('remove', () => {
    it('should remove product', async () => {
      productsRepository.softDelete.mockResolvedValue({
        affected: 1,
        raw: mockProduct,
        generatedMaps: [],
      });
      expect(await service.remove(mockProduct.id)).toEqual({
        affected: 1,
        raw: mockProduct,
        generatedMaps: [],
      });
    });

    it('should not remove product', async () => {
      productsRepository.softDelete.mockResolvedValue({
        affected: 0,
        raw: null,
        generatedMaps: [],
      });
      await expect(service.remove(mockProduct.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
