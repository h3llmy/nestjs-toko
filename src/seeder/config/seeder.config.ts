import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { glob } from 'glob';

export const SEEDER_FILES_PATH: string = 'src/domains/**/*.seeder.ts';
export const getAllEntity = async (): Promise<EntityClassOrSchema[]> => {
  const modules = await glob('src/domains/**/*.entity.ts');
  return Promise.all(
    modules.map((module) => import(module)),
  ) as unknown as EntityClassOrSchema[];
};
