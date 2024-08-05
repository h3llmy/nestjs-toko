import {
  DeepPartial,
  EntityManager,
  FindManyOptions,
  FindOptionsRelations,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
  SaveOptions,
  UpdateResult,
  getMetadataArgsStorage,
} from 'typeorm';
import {
  IPaginationPayload,
  IPaginationResponse,
  ITransactionManager,
} from './database.interface';

export class DefaultRepository<
  Entity extends ObjectLiteral,
> extends Repository<Entity> {
  /**
   * Get the name of the table associated with this repository.
   *
   * @return {string} The name of the table.
   */
  getTableName(): string {
    const metadata = getMetadataArgsStorage().tables.find(
      (table) => table.target === this.target,
    );
    return metadata ? metadata.name : '';
  }

  /**
   * Retrieves paginated data based on the specified page and limit.
   *
   * @param {IPaginationPayload<Entity>} paginationQuery - Additional pagination options.
   * @return {Promise<IPaginationResponse<Entity>>} A Promise containing paginated data.
   */
  async findPagination({
    page = 1,
    limit = 10,
    ...paginationQuery
  }: IPaginationPayload<Entity>): Promise<IPaginationResponse<Entity>> {
    const skip = (page - 1) * limit;
    const findOptions: FindManyOptions<Entity> = {
      skip,
      take: limit,
      ...paginationQuery,
    };

    const [data, totalData] = await this.findAndCount(findOptions);
    const totalPages = Math.ceil(totalData / limit);

    return {
      totalData,
      totalPages,
      page,
      limit,
      data,
    };
  }

  createEntity(
    entity: DeepPartial<Entity> | DeepPartial<Entity>[],
    options?: SaveOptions & ITransactionManager,
  ): Promise<DeepPartial<Entity>> {
    const query: EntityManager = options?.session
      ? options.session.manager
      : this.manager;
    delete options?.session;
    const createTarget = query.create(
      this.target,
      entity as DeepPartial<Entity>,
    );
    return query.save(this.target, createTarget, options);
  }

  /**
   * Saves an entity with optional save options.
   *
   * @param {DeepPartial<Entity>} entity - The entity to save.
   * @param {SaveOptions & ITransactionManager} [options] - Optional save options.
   * @return {Promise<DeepPartial<Entity>>} A promise that resolves with the saved entity.
   */
  saveEntity(
    entity: DeepPartial<Entity> | DeepPartial<Entity>[],
    options?: SaveOptions & ITransactionManager,
  ): Promise<DeepPartial<Entity>> {
    const query: EntityManager = options?.session
      ? options.session.manager
      : this.manager;
    delete options?.session;
    return query.save(this.target, entity as DeepPartial<Entity>, options);
  }

  /**
   * Updates a record in the database by incrementing the specified fields.
   *
   * @param {FindOptionsWhere<Entity>} conditions - The conditions to match the record to be updated.
   * @param {DeepPartial<Entity>} incrementValues - The values to increment in the record.
   * @param {ITransactionManager} [transaction] - Optional transaction manager.
   * @return {Promise<Entity>} A promise that resolves to the updated record.
   */
  async updateIncrement(
    conditions: FindOptionsWhere<Entity>,
    incrementValues: DeepPartial<Entity>,
    transaction?: ITransactionManager,
  ): Promise<Entity> {
    const queryBuilder = (
      transaction?.session
        ? transaction.session.manager.createQueryBuilder()
        : this.createQueryBuilder()
    ).update(this.target);

    const setClauses: Partial<Record<keyof Entity, () => string>> = {};
    const parameters: Record<string, any> = {};

    for (const key in incrementValues) {
      if (incrementValues.hasOwnProperty(key)) {
        const paramKey = `increment_${key}`;
        setClauses[key as keyof Entity] = () => `${key} + :${paramKey}`;
        parameters[paramKey] = incrementValues[key];
      }
    }

    queryBuilder.set(setClauses);
    queryBuilder.where(conditions).setParameters(parameters).returning('*');

    const result = await queryBuilder.execute();

    return result.raw[0];
  }

  /**
   * Updates a record in the database by decrementing the specified fields.
   *
   * @param {FindOptionsWhere<Entity>} conditions - The conditions to match the record to be updated.
   * @param {DeepPartial<Entity>} decrementValues - The values to decrement in the record.
   * @param {ITransactionManager} [transaction] - Optional transaction manager.
   * @return {Promise<Entity>} A promise that resolves to the updated record.
   */
  async updateDecrement(
    conditions: FindOptionsWhere<Entity>,
    decrementValues: DeepPartial<Entity>,
    transaction?: ITransactionManager,
  ): Promise<Entity> {
    const queryBuilder = (
      transaction?.session
        ? transaction.session.manager.createQueryBuilder()
        : this.createQueryBuilder()
    ).update(this.target);

    const setClauses: Partial<Record<keyof Entity, () => string>> = {};
    const parameters: Record<string, any> = {};

    for (const key in decrementValues) {
      if (decrementValues.hasOwnProperty(key)) {
        const paramKey = `decrement_${key}`;
        setClauses[key as keyof Entity] = () => `${key} - :${paramKey}`;
        parameters[paramKey] = decrementValues[key];
      }
    }

    queryBuilder.set(setClauses);
    queryBuilder.where(conditions).setParameters(parameters).returning('*');

    const result = await queryBuilder.execute();

    return result.raw[0];
  }

  /**
   * Updates a record in the database based on the given conditions and returns the updated record.
   *
   * @param {FindOptionsWhere<Entity>} findOption - The conditions to find the record to update.
   * @param {Partial<Entity>} updatedData - The data to update the record with.
   * @param {ITransactionManager} [options] - Optional update option.
   * @return {Promise<Entity>} A Promise that resolves to the updated record.
   */
  async updateAndFind(
    findOption: FindOptionsWhere<Entity>,
    updatedData: Partial<Entity>,
    options?: ITransactionManager & {
      relations?: FindOptionsRelations<Entity>;
    },
  ): Promise<Entity> {
    delete updatedData.id;

    const queryRunner = options?.session
      ? options.session.manager
      : this.manager;
    await queryRunner.update(this.target, findOption, updatedData);

    return this.findOne({ where: findOption, relations: options?.relations });
  }

  /**
   * Update an entity based on the provided options and return the update result.
   *
   * @param {FindOptionsWhere<Entity>} findOption - The options to find the entity to update.
   * @param {Partial<Entity>} updatedData - The data to update the entity with.
   * @param {ITransactionManager} [options] - Optional transaction manager for the update.
   * @return {Promise<UpdateResult>} A Promise that resolves to the update result.
   */
  async updateEntity(
    findOption: FindOptionsWhere<Entity>,
    updatedData: Partial<Entity>,
    options?: ITransactionManager,
  ): Promise<UpdateResult> {
    delete updatedData?.id;

    const queryRunner = options?.session
      ? options.session.manager
      : this.manager;
    return queryRunner.update(this.target, findOption, updatedData);
  }
}
