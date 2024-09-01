import { OrderDetails } from '@domains/orders/entities/orderDetails.entity';
import { Product } from '@domains/products/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Discounts')
export class Discount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Index({ unique: true })
  @Column({ unique: true })
  code: string;

  @Column()
  percentage: number;

  @Column()
  startDate: number;

  @Column()
  endDate: number;

  @ManyToMany(() => Product, (product) => product.discounts)
  @JoinTable({
    name: 'ProductsDiscounts',
  })
  products?: Product[];

  @OneToMany(() => OrderDetails, (orderDetails) => orderDetails.discount)
  orderDetails?: OrderDetails;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt?: Date;
}
