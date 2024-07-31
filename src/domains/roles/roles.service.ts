import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleRepository } from './role.repository';
import { DeepPartial, ILike, SaveOptions, UpdateResult } from 'typeorm';
import { IPaginationPayload, ITransactionManager } from '@app/common';
import { Role } from './entities/role.entity';
import { PaginationRoleDto } from './dto/pagination-role.dto';
import { PermissionsService } from '../permissions/permissions.service';

@Injectable()
export class RolesService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly permissionService: PermissionsService,
  ) {}

  /**
   * Creates a new role using the provided data.
   *
   * @param {CreateRoleDto} createRoleDto - The data to create the role.
   * @param {SaveOptions & ITransactionManager} [options] - Optional options for saving the role.
   * @return {Promise<DeepPartial<Role>>} A promise that resolves to the created role.
   */
  async create(
    createRoleDto: CreateRoleDto,
    options?: SaveOptions & ITransactionManager,
  ): Promise<DeepPartial<Role>> {
    let createData: Partial<Role> = { ...createRoleDto };

    if (createRoleDto.permissionId) {
      const permissions = await this.permissionService.findManyById(
        createRoleDto.permissionId,
      );
      createData.permissions = permissions;
    }
    delete (createData as CreateRoleDto).permissionId;
    return this.roleRepository.saveEntity(createData, options);
  }

  findAll(findQuery: PaginationRoleDto) {
    const { search, ...paginationQuery } = findQuery;
    const query: IPaginationPayload<Role> = {
      ...paginationQuery,
    };

    if (search) {
      query.where = {
        name: ILike(`%${search}%`),
      };
    }
    return this.roleRepository.findPagination(query);
  }

  /**
   * Retrieves a role from the role repository by its ID.
   *
   * @param {string} id - The ID of the role to find.
   * @return {Promise<Role | null>} A promise that resolves to the found role, or null if not found.
   */
  findOne(id: string): Promise<Role | null> {
    return this.roleRepository.findOne({ where: { id } });
  }

  /**
   * Finds a role by its name.
   *
   * @param {string} name - The name of the role to find.
   * @return {Promise<Role | null>} A promise that resolves to the found role, or null if not found.
   */
  findOneByName(name: string): Promise<Role | null> {
    return this.roleRepository.findOne({ where: { name } });
  }

  /**
   * Updates a role by its ID.
   *
   * @param {string} id - The ID of the role to update.
   * @param {UpdateRoleDto} updateRoleDto - The data to update the role with.
   * @return {Promise<Role | null>} A promise that resolves to the updated role, or null if not found.
   */
  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role | null> {
    let updateData: Partial<Role> = { ...updateRoleDto };

    if (updateRoleDto.permissionId) {
      const permissions = await this.permissionService.findManyById(
        updateRoleDto.permissionId,
      );
      updateData.permissions = permissions;
    }
    delete (updateData as UpdateRoleDto).permissionId;

    return this.roleRepository.updateAndFind({ id }, updateData);
  }

  /**
   * Removes a role by its ID.
   *
   * @param {string} id - The ID of the role to remove.
   * @return {Promise<UpdateResult>} A promise that resolves when the role is successfully removed.
   */
  remove(id: string): Promise<UpdateResult> {
    return this.roleRepository.softDelete(id);
  }
}
