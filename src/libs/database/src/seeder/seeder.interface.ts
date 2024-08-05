import { DataSource } from 'typeorm';
/**
 * Interface for classes that can run seeders.
 *
 * @interface ISeederRunner
 */
export interface ISeederRunner {
  /**
   * Runs the seeding logic using the provided data source.
   *
   * @param {DataSource} dataSource - The data source to use for seeding.
   * @returns {Promise<void>} A promise that resolves when the seeding process is complete.
   */
  run(dataSource: DataSource): Promise<void>;
}
/**
 * Interface for seeding data.
 *
 * @example
 * ```ts
 * const roles: ISeederData = {
 *   admin:
 *    [
 *      'get all users',
 *      'get user profile',
 *      'get user by id',
 *      'update profile',
 *      'delete user'
 *    ],
 *    user: [
 *      'get user profile',
 *      'update profile'
 *    ]
 * }
 * ```
 */
export interface ISeederData {
  [roleName: string]: string[];
}
