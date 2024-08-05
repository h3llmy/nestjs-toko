import { Injectable } from '@nestjs/common';
import { PermissionRepository } from './permission.repository';
import { IPaginationPayload, IPaginationResponse } from '@libs/database';
import { Permissions } from './entities/permission.entity';
import { FindOptionsRelations, ILike, In } from 'typeorm';
import { PaginationPermissionDto } from './dto/pagination-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  /**
   * Retrieves a paginated list of permissions based on the given search criteria.
   *
   * @param {PaginationPermissionDto} findQuery - The search criteria for permissions.
   * @return {Promise<IPaginationResponse<Permissions>>} A promise that resolves to the paginated response containing permissions.
   */
  findAllPagination(
    findQuery: PaginationPermissionDto,
  ): Promise<IPaginationResponse<Permissions>> {
    const { search, ...paginationQuery } = findQuery;
    const query: IPaginationPayload<Permissions> = {
      ...paginationQuery,
    };

    if (search) {
      query.where = {
        name: ILike(`%${search}%`),
      };
    }
    return this.permissionRepository.findPagination(query);
  }

  /**
   * Finds multiple permissions by their IDs.
   *
   * @param {string[]} id - An array of permission IDs.
   * @param {FindOptionsRelations<Permissions>} [relations] - The relations to include in the result.
   * @return {Promise<Permissions[]>} A promise that resolves to an array of permissions.
   */
  findManyById(
    id: string[],
    relations?: FindOptionsRelations<Permissions>,
  ): Promise<Permissions[]> {
    return this.permissionRepository.find({
      where: {
        id: In(id),
      },
      relations,
    });
  }

  /**
   * Finds a permission by its ID.
   *
   * @param {string} id - The ID of the permission to find.
   *    * @param {FindOptionsRelations<Permissions>} [relations] - The relations to include in the result.
   * @return {Promise<Permissions | null>} A promise that resolves to the found permission.
   */
  findOne(
    id: string,
    relations?: FindOptionsRelations<Permissions>,
  ): Promise<Permissions | null> {
    return this.permissionRepository.findOne({ where: { id }, relations });
  }
}
