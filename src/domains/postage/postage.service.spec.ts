import { TestBed } from '@automock/jest';
import { PostageService } from './postage.service';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { lastValueFrom, of } from 'rxjs';
import { IRajaOngkirResponse } from './postage.interface';
import { PostageProvinceDto } from './dto/province.dto';
import { CityDto } from './dto/city.dto';
import { CheckPriceCostDto, Courier } from './dto/check-price-cost.dto';
import { PriceCostDto } from './dto/price-cost.dto';

jest.mock('rxjs', () => ({
  ...jest.requireActual('rxjs'),
  lastValueFrom: jest.fn(),
}));

describe('PostageService', () => {
  let service: PostageService;
  let httpService: jest.Mocked<HttpService>;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(PostageService).compile();

    service = unit;
    httpService = unitRef.get(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(httpService).toBeDefined();
  });

  describe('getAllProvinces', () => {
    it('should be defined', () => {
      expect(service.getAllProvinces).toBeDefined();
    });

    it('should return an array of PostageProvinceDto', async () => {
      const response: PostageProvinceDto[] = [
        {
          province_id: '1',
          province: 'Jawa Barat',
        },
      ];

      const axiosResponse = mockAxiosResponse(response);

      const observable = of(axiosResponse);

      httpService.get.mockReturnValueOnce(observable);

      (lastValueFrom as jest.Mock).mockResolvedValue(axiosResponse);

      const result = await service.getAllProvinces();
      expect(result).toEqual(response);
      expect(httpService.get).toHaveBeenCalledWith('province');
      expect(lastValueFrom).toHaveBeenCalledWith(observable);
    });
  });

  describe('getOneProvince', () => {
    it('should be defined', () => {
      expect(service.getOneProvince).toBeDefined();
    });

    it('should return a PostageProvinceDto', async () => {
      const response: PostageProvinceDto = {
        province_id: '1',
        province: 'Jawa Barat',
      };

      const axiosResponse = mockAxiosResponse(response);

      const observable = of(axiosResponse);

      httpService.get.mockReturnValueOnce(observable);

      (lastValueFrom as jest.Mock).mockResolvedValue(axiosResponse);

      const result = await service.getOneProvince('1');
      expect(result).toEqual(response);
      expect(httpService.get).toHaveBeenCalledWith('province', {
        params: { id: '1' },
      });
      expect(lastValueFrom).toHaveBeenCalledWith(observable);
    });
  });

  describe('getAllCities', () => {
    {
      it('should be defined', () => {
        expect(service.getAllCities).toBeDefined();
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

        const axiosResponse = mockAxiosResponse(response);

        const observable = of(axiosResponse);

        httpService.get.mockReturnValueOnce(observable);

        (lastValueFrom as jest.Mock).mockResolvedValue(axiosResponse);

        const result = await service.getAllCities('1');
        expect(result).toEqual(response);
        expect(httpService.get).toHaveBeenCalledWith('city', {
          params: { province: '1' },
        });
        expect(lastValueFrom).toHaveBeenCalledWith(observable);
      });
    }
  });

  describe('getOneCity', () => {
    it('should be defined', () => {
      expect(service.getOneCity).toBeDefined();
    });

    it('should return a CityDto', async () => {
      const response: CityDto = {
        city_id: '1',
        province_id: '1',
        province: 'Jawa Barat',
        type: 'Kota',
        city_name: 'Bandung',
        postal_code: '40123',
      };

      const axiosResponse = mockAxiosResponse(response);

      const observable = of(axiosResponse);

      httpService.get.mockReturnValueOnce(observable);

      (lastValueFrom as jest.Mock).mockResolvedValue(axiosResponse);

      const result = await service.getOneCity('1');
      expect(result).toEqual(response);
      expect(httpService.get).toHaveBeenCalledWith('city', {
        params: { id: '1' },
      });
      expect(lastValueFrom).toHaveBeenCalledWith(observable);
    });
  });

  describe('getPrice', () => {
    it('should be defined', () => {
      expect(service.getPrice).toBeDefined();
    });

    it('should return a price cost', async () => {
      const request: CheckPriceCostDto = {
        courier: Courier.JNE,
        destination: '1',
        origin: '2',
        weight: 10000,
      };

      const response: PriceCostDto = {
        code: 'jne',
        name: 'test',
        costs: [
          {
            service: 'test service',
            description: 'test description',
            cost: [
              {
                etd: '1-3',
                note: 'test note',
                value: 30000,
              },
            ],
          },
        ],
      };

      const axiosResponse = mockAxiosResponse(response);

      const observable = of(axiosResponse);

      httpService.post.mockReturnValueOnce(observable);

      (lastValueFrom as jest.Mock).mockResolvedValue(axiosResponse);

      const result = await service.getPrice(request);
      expect(result).toEqual(response);
      expect(httpService.post).toHaveBeenCalledWith('cost', request);
      expect(lastValueFrom).toHaveBeenCalledWith(observable);
    });
  });
});

function mockAxiosResponse<Response = any>(
  responseData: Response,
): AxiosResponse<IRajaOngkirResponse<Response>> {
  return {
    data: {
      rajaongkir: {
        status: {
          code: 200,
          description: 'OK',
        },
        query: {
          id: '1',
        },
        results: responseData,
      },
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {
      headers: undefined,
    },
  };
}
