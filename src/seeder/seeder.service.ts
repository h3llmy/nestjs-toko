import { Injectable, Logger } from '@nestjs/common';
import { glob } from 'glob';
import { SEEDER_FILES_PATH } from './config/seeder.config';
import { ISeederRunner } from './seeder.interface';
import { DataSource } from 'typeorm';
import 'reflect-metadata';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name, { timestamp: true });

  constructor(private readonly dataSource: DataSource) {}

  async seed() {
    this.logger.log('Seeding...');
    const modules = await glob(SEEDER_FILES_PATH);

    for (const module of modules) {
      const importedModule = await import(module);

      // Iterate through all properties in importedModule
      for (const key of Object.keys(importedModule)) {
        const seederClass = importedModule[key];

        if (typeof seederClass === 'function') {
          const isSeeder = Reflect.getMetadata('isSeederClass', seederClass);

          if (isSeeder) {
            const moduleConstructor: ISeederRunner = new seederClass();
            this.logger.log(`Seeding ${seederClass.name}...`);
            try {
              await moduleConstructor.run(this.dataSource);
              this.logger.log(`Seeding ${seederClass.name} Success`);
            } catch (error) {
              this.logger.error(`Seeding ${seederClass.name} Failed`, error);
            }
          }
        }
      }
    }

    this.logger.log('Seeding done!');
  }
}
