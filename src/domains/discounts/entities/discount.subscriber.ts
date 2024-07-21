import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { Discount } from './discount.entity';
import { DiscountsRepository } from '../discounts.repository';

@EventSubscriber()
export class DiscountSubscribers
  implements EntitySubscriberInterface<Discount>
{
  /**
   * Constructs a new instance of the DiscountSubscribers class.
   *
   * @param {DataSource} dataSource - The data source used by the subscriber.
   * @param {EncryptionService} encryptionService - The encryption service used by the subscriber.
   * @param {DiscountsRepository} discountService - The discount repository used by the subscriber.
   */
  constructor(
    private readonly dataSource: DataSource,
    private readonly discountService: DiscountsRepository,
  ) {
    dataSource.subscribers.push(this);
  }

  /**
   * Returns the Discount class.
   *
   * @return {typeof Discount} The Discount class.
   */
  listenTo(): typeof Discount {
    return Discount;
  }

  /**
   * Asynchronously checks if the email of the provided discount entity is already in use
   * and hashes the password before inserting the entity into the database.
   *
   * @param {InsertEvent<Discount>} event - The event object containing the entity to be inserted.
   * @return {Promise<void>} A promise that resolves when the entity is successfully inserted.
   * @throws {BadRequestException} If the email of the provided discount entity is already in use.
   */
  async beforeInsert({ entity }: InsertEvent<Discount>): Promise<void> {
    const discountCheck = await this.discountService.findOneBy({
      code: entity.code,
    });

    if (discountCheck)
      throw new BadRequestException(`code ${entity.code} is already in used`);
  }

  /**
   * Hashes the password of a discount entity before it is updated.
   *
   * @param {UpdateEvent<Discount>} event - The update event containing the entity.
   * @return {Promise<void> } This function does not return anything.
   */
  async beforeUpdate({ entity }: UpdateEvent<Discount>): Promise<void> {
    const discountCheck = await this.discountService.findOneBy({
      code: entity.code,
    });

    if (discountCheck && discountCheck.id !== entity.id)
      throw new BadRequestException(`code ${entity.code} is already in used`);
  }
}
