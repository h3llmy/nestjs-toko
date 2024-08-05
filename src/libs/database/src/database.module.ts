import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleConfig } from './config/typeOrmModule.config';

@Module({
  imports: [TypeOrmModule.forRootAsync(typeOrmModuleConfig)],
})
export class DatabaseModule {}
