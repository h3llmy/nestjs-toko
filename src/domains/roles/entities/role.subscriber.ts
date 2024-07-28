import { DataSource, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { RoleRepository } from '../role.repository';
import { Role } from './role.entity';
import { NotFoundException } from '@nestjs/common';

@EventSubscriber()
export class RoleSubscribers {
  constructor(
    private readonly dataSource: DataSource,
    private readonly roleRepository: RoleRepository,
  ) {
    dataSource.subscribers.push(this);
  }

  /**
   * Returns the type of Role.
   *
   * @return {typeof Role} The type of Role.
   */
  listenTo(): typeof Role {
    return Role;
  }

  /**
   * Asynchronously checks if the name of the provided Role entity is already in use
   * before inserting the entity into the database.
   *
   * @param {InsertEvent<Role>} event - The event object containing the entity to be inserted.
   * @return {Promise<void>} A promise that resolves when the entity is successfully inserted.
   * @throws {Error} If the name of the provided Role entity is already in use.
   */
  async beforeInsert({ entity }: InsertEvent<Role>): Promise<void> {
    const roleCheck = await this.roleRepository.findOneBy({
      name: entity.name,
    });

    if (roleCheck)
      throw new NotFoundException(`name ${entity.name} is already available`);
  }

  /**
   * Asynchronously checks if the name of the provided Role entity is already in use
   * before updating the entity in the database.
   *
   * @param {UpdateEvent<Role>} entity - The event object containing the entity to be updated.
   * @return {Promise<void>} A promise that resolves when the entity is successfully updated.
   */
  async beforeUpdate({ entity }: UpdateEvent<Role>): Promise<void> {
    const roleCheck = await this.roleRepository.findOneBy({
      name: entity.name,
    });

    if (roleCheck && roleCheck.id !== entity.id)
      throw new NotFoundException(`name ${entity.name} is already available`);
  }
}
