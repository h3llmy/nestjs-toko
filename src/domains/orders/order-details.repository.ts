import { DefaultRepository } from '@app/common';
import { OrderDetails } from './entities/orderDetails.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class OrderDetailsRepository extends DefaultRepository<OrderDetails> {
  constructor(
    @InjectRepository(OrderDetails)
    private orderDetailsRepository: Repository<OrderDetails>,
  ) {
    super(
      orderDetailsRepository.target,
      orderDetailsRepository.manager,
      orderDetailsRepository.queryRunner,
    );
  }
}
