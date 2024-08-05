import { DefaultRepository } from '@libs/database';
import { InjectRepository } from '@nestjs/typeorm';
import { Permissions } from './entities/permission.entity';
import { Repository } from 'typeorm';

export class PermissionRepository extends DefaultRepository<Permissions> {
  constructor(
    @InjectRepository(Permissions)
    private readonly permissionRepository: Repository<Permissions>,
  ) {
    super(
      permissionRepository.target,
      permissionRepository.manager,
      permissionRepository.queryRunner,
    );
  }
}
