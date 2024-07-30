import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionRepository } from './permission.repository';
import { IPaginationPayload } from '@app/common';
import { Permissions } from './entities/permission.entity';
import { ILike } from 'typeorm';

@Injectable()
export class PermissionsService {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  findAll(findQuery: any) {
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

  findOne(id: string) {
    return this.permissionRepository.findOne({ where: { id } });
  }

  updateRoles(id: string, updatePermissionsRolesDto: any) {
    return this.permissionRepository.update(id, updatePermissionsRolesDto);
  }
}
