import { Injectable, Logger } from '@nestjs/common';
import { glob } from 'glob';
import { SEEDER_FILES_PATH } from './config/seeder.config';
import { SeederRunner } from './seeder.interface';
import { DataSource } from 'typeorm';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name, { timestamp: true });

  constructor(private readonly dataSource: DataSource) {}

  async seed() {
    this.logger.log('Seeding...');
    const modules = await glob(SEEDER_FILES_PATH);

    for (const module of modules) {
      const importedModule = await import(module);
      const isSeeder = Reflect.getMetadata(
        'isSeederClass',
        importedModule.default,
      );

      if (isSeeder) {
        const moduleConstructor: SeederRunner = new importedModule.default();
        this.logger.log(`Seeding ${importedModule.default.name}...`);
        try {
          await moduleConstructor.run(this.dataSource);
          this.logger.log(`Seeding ${importedModule.default.name} Success`);
        } catch (error) {
          this.logger.error(
            `Seeding ${importedModule.default.name} Failed`,
            error,
          );
        }
      }
    }

    this.logger.log('Seeding done!');
  }
}
