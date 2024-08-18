import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './users.repository';
import { EncryptionModule } from '@libs/encryption';
import { UserSubscribers } from './entities/user.subscriber';
import { RolesModule } from '@domains/roles/roles.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), EncryptionModule, RolesModule],
  controllers: [UsersController],
  providers: [UsersService, UserRepository, UserSubscribers],
  exports: [UsersService],
})
export class UsersModule {}
