import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RoleRepository } from './role.repository';
import { RoleSubscribers } from './entities/role.subscriber';
import { PermissionsModule } from '@domains/permissions/permissions.module';

@Module({
  imports: [TypeOrmModule.forFeature([Role]), PermissionsModule],
  controllers: [RolesController],
  providers: [RolesService, RoleRepository, RoleSubscribers],
  exports: [RolesService],
})
export class RolesModule {}
