import { DynamicModule, Module, Provider } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleSeederConfig } from '@libs/database/config/typeOrmModule.config';
import { SEEDER_FILES_PATH, SEEDER_MODULE_NAME } from './config/seeder.config';
import { glob } from 'glob';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configModuleConfig } from '@libs/common/config/configModule.config';
import { EncryptionModule } from '@libs/encryption';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmModuleSeederConfig),
    ConfigModule.forRoot(configModuleConfig),
    EncryptionModule,
  ],
  providers: [SeederService],
})
export class SeederModule {
  /**
   * Creates a dynamic module for the seeder.
   *
   * @return {Promise<DynamicModule>} A promise that resolves to a dynamic module.
   */
  static async forRoot(): Promise<DynamicModule> {
    const providersValue = await this.importSeederModule();
    const providers = this.createSeederProviders(providersValue);

    return {
      module: SeederModule,
      providers: [
        providers,
        ...providersValue.map((provider) => {
          return {
            provide: provider.constructor,
            useClass: provider.constructor,
          };
        }),
      ],
      exports: [SeederService],
    };
  }

  /**
   * Creates a provider for seeder classes.
   *
   * @return {Provider} A provider that returns an array of seeder class instances.
   */
  private static createSeederProviders(
    providersValue: {
      constructor: new (...args: any[]) => any;
      priority: number;
    }[],
  ): Provider {
    return {
      provide: SEEDER_MODULE_NAME,
      useFactory: async (
        ...args: any[]
      ): Promise<(new (...args: any[]) => any)[]> => {
        return providersValue
          .sort((a, b) => a.priority - b.priority)
          .map((seederClass) => seederClass.constructor);
      },
      inject: [ConfigService],
    };
  }

  private static async importSeederModule() {
    const providersValue: Array<{
      constructor: new (...args: any[]) => any;
      priority: number;
    }> = [];
    const modules = await glob(SEEDER_FILES_PATH, {
      stat: true,
    });

    for (const module of modules) {
      const importedModule = await import(module);
      for (const key of Object.keys(importedModule)) {
        const seederClass = importedModule[key];
        if (typeof seederClass === 'function') {
          const isSeeder = Reflect.getMetadata('isSeederClass', seederClass);
          const priority = Reflect.getMetadata('priority', seederClass);
          if (isSeeder) {
            providersValue.push({
              constructor: seederClass,
              priority,
            });
          }
        }
      }
    }
    return providersValue;
  }
}
