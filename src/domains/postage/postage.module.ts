import { Module } from '@nestjs/common';
import { PostageService } from './postage.service';
import { PostageController } from './postage.controller';
import { HttpModule } from '@nestjs/axios';
import { rajaOngkirHttpConfig } from './config/rajaongkir.http.config';

@Module({
  imports: [HttpModule.registerAsync(rajaOngkirHttpConfig)],
  providers: [PostageService],
  controllers: [PostageController],
  exports: [PostageService],
})
export class PostageModule {}
