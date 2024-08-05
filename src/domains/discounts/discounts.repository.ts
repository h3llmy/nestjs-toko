import { DefaultRepository } from '@libs/database';
import { Discount } from './entities/discount.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class DiscountsRepository extends DefaultRepository<Discount> {
  constructor(
    @InjectRepository(Discount)
    private discountRepository: Repository<Discount>,
  ) {
    super(
      discountRepository.target,
      discountRepository.manager,
      discountRepository.queryRunner,
    );
  }
}
