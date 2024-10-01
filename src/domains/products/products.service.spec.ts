import { TestBed } from '@automock/jest';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';
import { Product } from './entities/product.entity';
import { IPaginationResponse } from '@libs/database';
import { NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { Inventory } from '@domains/inventories/entities/inventory.entity';
import { ProductCategory } from '@domains/product-category/entities/product-category.entity';
import { ProductCategoryService } from '@domains/product-category/product-category.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { MimeType } from 'nestjs-formdata-interceptor';

describe('ProductsService', () => {
  let service: ProductsService;
  let productsRepository: jest.Mocked<ProductsRepository>;
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
    images: [
      {
        id: '1',
        url: 'something',
      },
    ],
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
    productCategoryService = unitRef.get(ProductCategoryService);
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
        images: [
          {
            buffer: Buffer.from('test'),
            encoding: 'base64',
            fileExtension: 'jpg',
            fileName: 'test.jpg',
            fileNameFull: 'test.jpg',
            fileSize: 100,
            hash: 'something',
            save: jest.fn().mockReturnValue('something'),
            mimetype: MimeType['image/jpeg'],
            originalFileName: 'test.jpg',
          },
        ],
      };

      productsRepository.save.mockResolvedValueOnce(mockProductInventory);
      productCategoryService.findOne.mockResolvedValue(mockCategory);

      const result = await service.create(mockCreateProduct);

      expect(productsRepository.save).toHaveBeenCalledWith({
        name: mockCreateProduct.name,
        price: mockCreateProduct.price,
        description: mockCreateProduct.description,
        categoryId: mockCreateProduct.categoryId,
        category: {
          ...mockCategory,
          id: '1',
        },
        images: [{ url: 'something' }],
        inventory: {
          quantity: mockCreateProduct.quantity,
        },
      });
      expect(productCategoryService.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockProductInventory);
    });

    it('should rollback transaction on category not found', async () => {
      const mockCreateProduct: CreateProductDto = {
        name: 'Test Product',
        price: 10,
        description: 'Test Product',
        quantity: 10,
        categoryId: '1',
        images: [
          {
            buffer: Buffer.from('test'),
            encoding: 'base64',
            fileExtension: 'jpg',
            fileName: 'test.jpg',
            fileNameFull: 'test.jpg',
            fileSize: 100,
            hash: 'something',
            save: jest.fn().mockReturnValue('something'),
            mimetype: MimeType['image/jpeg'],
            originalFileName: 'test.jpg',
          },
        ],
      };

      productCategoryService.findOne.mockRejectedValue(
        new NotFoundException('Product category not found'),
      );

      await expect(service.create(mockCreateProduct)).rejects.toThrow(
        NotFoundException,
      );

      expect(productsRepository.save).not.toHaveBeenCalled();
      expect(productCategoryService.findOne).toHaveBeenCalledWith('1');
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
          images: true,
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
      expect(productCategoryService.findOne).toHaveBeenCalledWith(
        mockCategory.id,
      );
      expect(productsRepository.updateAndFind).toHaveBeenCalledWith(
        { id: mockProduct.id },
        {
          name: 'Test Product',
          price: 10,
          category: mockCategory,
          description: 'Test Product',
        },
        {
          relations: {
            category: true,
            inventory: true,
            images: true,
          },
        },
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
