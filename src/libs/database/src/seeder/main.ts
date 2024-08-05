import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeder.module';
import { SeederService } from './seeder.service';
import { ApplicationAdapter } from '@libs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';

(async () => {
  const app = await NestFactory.create<NestFastifyApplication>(
    SeederModule,
    new ApplicationAdapter(),
  );

  const seeder = app.get(SeederService);

  await seeder.seed();
  await app.close();
})();
