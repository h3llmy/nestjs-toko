import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleSeederConfig } from '@libs/database/config/typeOrmModule.config';

@Module({
  imports: [TypeOrmModule.forRootAsync(typeOrmModuleSeederConfig)],
  providers: [SeederService],
})
export class SeederModule {}
