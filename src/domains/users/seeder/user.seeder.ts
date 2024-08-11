import { ISeederRunner, Seeder } from '@libs/database';
import { DataSource, DeepPartial, In } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '@domains/roles/entities/role.entity';
import { ConfigService } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';

@Seeder({
  priority: 1,
})
export class UserSeeder implements ISeederRunner {
  constructor(private readonly configService: ConfigService) {}

  async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);
    const roleRepository = dataSource.getRepository(Role);

    const adminRole = await roleRepository.findOneBy({ name: 'admin' });
    if (!adminRole) {
      throw new NotFoundException('admin role not found');
    }

    const defaultUser: DeepPartial<User>[] = [
      {
        username: this.configService.getOrThrow<string>('ADMIN_USERNAME'),
        email: this.configService.getOrThrow<string>('ADMIN_EMAIL'),
        password: this.configService.getOrThrow<string>('ADMIN_PASSWORD'),
        emailVerifiedAt: Date.now(),
        role: adminRole,
      },
    ];

    const users = await userRepository.find({
      where: {
        username: In(defaultUser.map((user) => user.username)),
      },
    });

    const newUser = defaultUser.filter(
      (userDefault) =>
        !users.some((user) => user.username === userDefault.username),
    );

    await userRepository.save(newUser);
  }
}
