import { ProductCategory } from '@domains/product-category/entities/product-category.entity';
import { Inventory } from '@domains/inventories/entities/inventory.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Discount } from '@domains/discounts/entities/discount.entity';
import { OrderDetails } from '@domains/orders/entities/orderDetails.entity';
import { ProductImages } from './product-images.entity';

@Entity('Products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column({ type: 'text' })
  description: string;

  @OneToOne(() => Inventory, (inventory) => inventory.product, {
    cascade: true,
  })
  inventory?: Inventory;

  @OneToMany(() => ProductImages, (images) => images.product, {
    cascade: true,
  })
  images?: ProductImages[];

  @ManyToOne(() => ProductCategory, (category) => category.product, {
    cascade: true,
  })
  category?: ProductCategory;

  @ManyToMany(() => Discount, (discount) => discount.products)
  discounts?: Discount[];

  @OneToMany(() => OrderDetails, (orderDetails) => orderDetails.product)
  orderDetails?: OrderDetails;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt?: Date;
}
