import { FindOneOptions, FindOptionsWhere, QueryRunner } from 'typeorm';

/**
 * Enum representing the sorting directions.
 */
export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface IPaginationPayload<Entity = any>
  extends FindOneOptions<Entity> {
  page?: number;
  limit?: number;
  search?: FindOptionsWhere<Entity>[] | FindOptionsWhere<Entity>;
}

/**
 * Interface representing the pagination response.
 */
export interface IPaginationResponse<Entity> {
  /**
   * The data for the current page.
   */
  data: Entity[];
  /**
   * The total number of data items across all pages.
   */
  totalData: number;
  /**
   * The total number of pages available.
   */
  totalPages: number;
  /**
   * The current page number (1-based index).
   */
  page: number;
  /**
   * The number of items per page.
   */
  limit: number;
}

export interface ITransactionManager {
  session?: QueryRunner;
}
