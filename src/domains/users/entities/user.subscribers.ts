import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { User } from './user.entity';
import { EncryptionService } from '@app/encryption';
import { UserRepository } from '../users.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RolesService } from '../../roles/roles.service';

@EventSubscriber()
export class UserSubscribers implements EntitySubscriberInterface<User> {
  /**
   * Constructs a new instance of the UserSubscribers class.
   *
   * @param {DataSource} dataSource - The data source used by the subscriber.
   * @param {EncryptionService} encryptionService - The encryption service used by the subscriber.
   * @param {UserRepository} userRepository - The user repository used by the subscriber.
   */
  constructor(
    private readonly dataSource: DataSource,
    private readonly encryptionService: EncryptionService,
    private readonly roleService: RolesService,
    private readonly userRepository: UserRepository,
  ) {
    dataSource.subscribers.push(this);
  }

  /**
   * Returns the User class.
   *
   * @return {typeof User} The User class.
   */
  listenTo(): typeof User {
    return User;
  }

  /**
   * Asynchronously checks if the email of the provided User entity is already in use
   * and hashes the password before inserting the entity into the database.
   *
   * @param {InsertEvent<User>} event - The event object containing the entity to be inserted.
   * @return {Promise<void>} A promise that resolves when the entity is successfully inserted.
   * @throws {BadRequestException} If the email of the provided User entity is already in use.
   */
  async beforeInsert({ entity }: InsertEvent<User>): Promise<void> {
    const userCheck = await this.userRepository.findOneBy({
      email: entity.email,
    });

    if (userCheck)
      throw new BadRequestException(`email ${entity.email} is already in used`);

    entity.password = this.encryptionService.hash(entity.password);
    if (!entity?.role) {
      const roleFind = await this.roleService.findOneByName('user');
      if (!roleFind) throw new NotFoundException('role not found');
      entity.role = roleFind;
    }
  }

  /**
   * Hashes the password of a user entity before it is updated.
   *
   * @param {UpdateEvent<User>} event - The update event containing the entity.
   * @return {void} This function does not return anything.
   */
  beforeUpdate({ entity }: UpdateEvent<User>): void {
    if (entity?.password) {
      entity.password = this.encryptionService.hash(entity.password);
    }
  }
}
