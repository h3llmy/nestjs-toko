import { DefaultRepository } from '@app/common';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

export class OrderRepository extends DefaultRepository<Order> {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {
    super(
      orderRepository.target,
      orderRepository.manager,
      orderRepository.queryRunner,
    );
  }
}
