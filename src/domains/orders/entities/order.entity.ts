import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderDetails } from './orderDetails.entity';

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

  @Column({ nullable: false })
  totalAmount: number;

  @OneToMany(() => OrderDetails, (orderDetails) => orderDetails.order)
  orderDetails?: OrderDetails[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}
