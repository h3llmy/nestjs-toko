import { TestBed } from '@automock/jest';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { IPaginationResponse } from '@libs/database';
import { NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { MimeType } from 'nestjs-formdata-interceptor';
import { ProductCategory } from '@domains/product-category/entities/product-category.entity';
import { Inventory } from '@domains/inventories/entities/inventory.entity';
import { ProductImages } from './entities/product-images.entity';

describe('ProductsController', () => {
  let controller: ProductsController;
  let productsService: jest.Mocked<ProductsService>;

  const mockCategory: ProductCategory = {
    id: '1',
    name: 'category 1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockProductInventory: Inventory = {
    id: '1',
    quantity: 10,
    updatedAt: new Date(),
  };

  const mockProductImages: ProductImages = {
    id: '1',
    url: 'something',
  };

  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    price: 10,
    description: 'Test Product',
    category: mockCategory,
    inventory: mockProductInventory,
    images: [mockProductImages],
    deletedAt: null,
    updatedAt: new Date(),
    createdAt: new Date(),
  };

  const mockProductsPagination: IPaginationResponse<Product> = {
    totalData: 1,
    totalPages: 1,
    page: 1,
    limit: 10,
    data: [mockProduct],
  };

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(ProductsController).compile();

    controller = unit;
    productsService = unitRef.get(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(productsService).toBeDefined();
  });

  describe('create', () => {
    it('should be defined', () => {
      expect(controller.create).toBeDefined();
    });
    it('should create new product', async () => {
      const mockCreateProduct: CreateProductDto = {
        name: mockProduct.name,
        price: 10,
        description: mockProduct.description,
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
            hash: 'test',
            save: jest.fn(),
            mimetype: MimeType['image/jpeg'],
            originalFileName: 'test.jpg',
          },
        ],
      };
      productsService.create.mockResolvedValue(mockProduct);
      expect(await controller.create(mockCreateProduct)).toEqual(mockProduct);
    });
  });

  describe('findAllPagination', () => {
    it('should be defined', () => {
      expect(controller.findAllPagination).toBeDefined();
    });
    it('should get list products with pagination', async () => {
      productsService.findAllPagination.mockResolvedValue(
        mockProductsPagination,
      );
      const paginationOption = {
        page: 1,
        limit: 10,
      };
      const products = await controller.findAllPagination(paginationOption);
      expect(productsService.findAllPagination).toHaveBeenCalledWith(
        paginationOption,
      );
      expect(products).toEqual(mockProductsPagination);
    });
  });

  describe('findOne', () => {
    it('should be defined', () => {
      expect(controller.findOne).toBeDefined();
    });
    it('should get a product by id', async () => {
      productsService.findOne.mockResolvedValue(mockProduct);
      const product = await controller.findOne('1');
      expect(productsService.findOne).toHaveBeenCalledWith('1', {
        inventory: true,
      });
      expect(product).toEqual(mockProduct);
    });

    it('should throw NotFoundException if product not found', async () => {
      productsService.findOne.mockResolvedValue(null);
      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should be defined', () => {
      expect(controller.update).toBeDefined();
    });
    it('should update product', async () => {
      const mockUpdateProduct: UpdateProductDto = {
        name: mockProduct.name,
        price: 10,
        description: mockProduct.description,
        categoryId: '1',
      };
      productsService.update.mockResolvedValue(mockProduct);
      expect(await controller.update('1', mockUpdateProduct)).toEqual(
        mockProduct,
      );
    });

    it('should throw NotFoundException if product not found', async () => {
      const mockUpdateProduct: UpdateProductDto = {
        name: mockProduct.name,
        price: 10,
        description: mockProduct.description,
        categoryId: '1',
      };
      productsService.update.mockResolvedValue(null);
      await expect(controller.update('1', mockUpdateProduct)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should be defined', () => {
      expect(controller.remove).toBeDefined();
    });
    it('should remove product', async () => {
      productsService.remove.mockResolvedValue({
        affected: 1,
        raw: mockProduct,
        generatedMaps: [],
      });
      expect((await controller.remove('1')).message).toBeDefined();
    });

    it('should throw NotFoundException if product not found', async () => {
      productsService.remove.mockRejectedValue(new NotFoundException());
      await expect(controller.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
