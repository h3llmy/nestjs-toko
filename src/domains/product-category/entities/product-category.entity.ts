import { OrderDetails } from '../../orders/entities/orderDetails.entity';
import { Product } from '../../products/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('ProductCategories')
export class ProductCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Product, (product) => product.category)
  product?: Product;

  @ManyToOne(() => OrderDetails, (orderDetails) => orderDetails.category)
  orderDetails?: OrderDetails;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt?: Date;
}
