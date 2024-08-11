import { Inject, Injectable, Logger } from '@nestjs/common';
import { SEEDER_MODULE_NAME } from './config/seeder.config';
import { ISeederRunner } from './seeder.interface';
import { DataSource } from 'typeorm';
import 'reflect-metadata';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name, { timestamp: true });

  constructor(
    private readonly dataSource: DataSource,
    @Inject(SEEDER_MODULE_NAME)
    private readonly seederProviders: ISeederRunner[],
  ) {}

  /**
   * Asynchronously seeds the database by importing and running all seeder classes found in the specified SEEDER_FILES_PATH.
   *
   * @return {Promise<void>} A promise that resolves when the seeding process is complete.
   */
  async runSeeder(): Promise<void> {
    this.logger.log('Seeding...');

    for (const seederProvider of this.seederProviders) {
      const seederName = seederProvider.constructor.name;
      this.logger.log(`Seeding ${seederName}...`);
      try {
        await seederProvider.run(this.dataSource);
        this.logger.log(`Seeding ${seederName} Success`);
      } catch (error) {
        this.logger.error(`Seeding ${seederName} Failed`, error);
      }
    }

    this.logger.log('Seeding done!');
  }
}
