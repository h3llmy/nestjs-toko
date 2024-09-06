import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { PostageProvinceDto } from './dto/province.dto';
import { CityDto } from './dto/city.dto';
import { CheckPriceCostDto } from './dto/check-price-cost.dto';
import { PriceCostDto } from './dto/price-cost.dto';
import { IRajaOngkirResponse } from './postage.interface';

@Injectable()
export class PostageService {
  constructor(private readonly httpService: HttpService) {}

  /**
   * Retrieves all provinces from Raja Ongkir API.
   *
   * @return {Promise<PostageProvinceDto[]>} A promise that resolves to an array of PostageProvinceDto objects.
   */
  async getAllProvinces(): Promise<PostageProvinceDto[]> {
    const response = await lastValueFrom(
      this.httpService.get<IRajaOngkirResponse<PostageProvinceDto[]>>(
        'province',
      ),
    );
    return response.data.rajaongkir.results;
  }

  /**
   * Retrieves a province by its ID from Raja Ongkir API.
   *
   * @param {string} id - The ID of the province to find.
   * @return {Promise<PostageProvinceDto>} A promise that resolves to the found province.
   *
   * @throws {NotFoundException} If the province is not found.
   */
  async getOneProvince(id: string): Promise<PostageProvinceDto> {
    const response = await lastValueFrom(
      this.httpService.get<IRajaOngkirResponse<PostageProvinceDto>>(
        'province',
        {
          params: { id },
        },
      ),
    );
    if (Array.isArray(response.data) && response.data.length === 0) {
      throw new NotFoundException('Province not found');
    }
    return response.data.rajaongkir.results;
  }

  /**
   * Retrieves all cities from Raja Ongkir API.
   *
   * @param {string} provinceId - The ID of the province to find cities from.
   * @return {Promise<CityDto[]>} A promise that resolves to an array of CityDto objects.
   */
  async getAllCities(provinceId: string): Promise<CityDto[]> {
    const response = await lastValueFrom(
      this.httpService.get<IRajaOngkirResponse<CityDto[]>>('city', {
        params: { province: provinceId },
      }),
    );
    return response.data.rajaongkir.results;
  }

  /**
   * Retrieves a city by its ID from Raja Ongkir API.
   *
   * @param {string} id - The ID of the city to find.
   * @return {Promise<CityDto>} A promise that resolves to the found city.
   *
   * @throws {NotFoundException} If the city is not found.
   */
  async getOneCity(id: string): Promise<CityDto> {
    const response = await lastValueFrom(
      this.httpService.get<IRajaOngkirResponse<CityDto>>('city', {
        params: { id },
      }),
    );
    if (Array.isArray(response.data) && response.data.length === 0) {
      throw new NotFoundException('City not found');
    }
    return response.data.rajaongkir.results;
  }

  /**
   * Retrieves the price cost of a shipment based on the provided check price cost data.
   *
   * @param {CheckPriceCostDto} checkPriceCost - The check price cost data.
   * @return {Promise<PriceCostDto>} A promise that resolves to the price cost of the shipment.
   */
  async getPrice(checkPriceCost: CheckPriceCostDto): Promise<PriceCostDto> {
    const checkPrice = await lastValueFrom(
      this.httpService.post<IRajaOngkirResponse<PriceCostDto>>(
        'cost',
        checkPriceCost,
      ),
    );
    return checkPrice.data.rajaongkir.results;
  }
}
