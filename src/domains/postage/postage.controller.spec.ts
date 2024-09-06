import { TestBed } from '@automock/jest';
import { PostageController } from './postage.controller';
import { PostageService } from './postage.service';
import { PostageProvinceDto } from './dto/province.dto';
import { CityDto } from './dto/city.dto';
import { PriceCostDto } from './dto/price-cost.dto';
import { CheckPriceCostDto, Courier } from './dto/check-price-cost.dto';

describe('PostageController', () => {
  let controller: PostageController;
  let postageService: jest.Mocked<PostageService>;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(PostageController).compile();

    controller = unit;
    postageService = unitRef.get<PostageService>(PostageService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(postageService).toBeDefined();
  });

  describe('getAllProvinces', () => {
    it('should be defined', () => {
      expect(controller.getAllProvinces).toBeDefined();
    });

    it('should return an array of PostageProvinceDto', async () => {
      const response: PostageProvinceDto[] = [
        {
          province_id: '1',
          province: 'Jawa Barat',
        },
      ];

      postageService.getAllProvinces.mockResolvedValue(response);

      const result = await controller.getAllProvinces();
      expect(result).toEqual(response);
      expect(postageService.getAllProvinces).toHaveBeenCalled();
    });
  });

  describe('getAllCities', () => {
    it('should be defined', () => {
      expect(controller.getAllCities).toBeDefined();
    });

    it('should return an array of CityDto', async () => {
      const response: CityDto[] = [
        {
          city_id: '1',
          province_id: '1',
          province: 'Jawa Barat',
          type: 'Kota',
          city_name: 'Bandung',
          postal_code: '40123',
        },
      ];

      postageService.getAllCities.mockResolvedValue(response);

      const result = await controller.getAllCities('1');
      expect(result).toEqual(response);
      expect(postageService.getAllCities).toHaveBeenCalledWith('1');
    });
  });

  describe('getPrice', () => {
    it('should be defined', () => {
      expect(controller.getPrice).toBeDefined();
    });

    it('should return a price list', async () => {
      const request: CheckPriceCostDto = {
        destination: '1',
        origin: '2',
        weight: 10000,
        courier: Courier.JNE,
      };
      const response: PriceCostDto = {
        code: 'jne',
        name: 'testing',
        costs: [
          {
            service: 'JNE',
            description: 'JNE',
            cost: [
              {
                value: 5000,
                etd: '1-2 days',
                note: '',
              },
            ],
          },
        ],
      };

      postageService.getPrice.mockResolvedValue(response);

      const result = await controller.getPrice(request);
      expect(result).toEqual(response);
      expect(postageService.getPrice).toHaveBeenCalledWith(request);
    });
  });
});
