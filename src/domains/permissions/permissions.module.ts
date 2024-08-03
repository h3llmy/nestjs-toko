import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permissions } from './entities/permission.entity';
import { PermissionRepository } from './permission.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Permissions])],
  controllers: [PermissionsController],
  providers: [PermissionsService, PermissionRepository],
  exports: [PermissionsService],
})
export class PermissionsModule {}
