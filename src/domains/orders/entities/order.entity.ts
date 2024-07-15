import { User } from '../../users/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum OrderStatus {
  PAID = 'paid',
  UNPAID = 'unpaid',
  FAILED = 'failed',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => User, (user) => user.order)
  user: User;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.UNPAID,
  })
  status: OrderStatus;
}
