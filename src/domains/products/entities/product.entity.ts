import { ProductCategory } from '../../product-category/entities/product-category.entity';
import { Inventory } from '../../inventories/entities/inventory.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Discount } from '../../discounts/entities/discount.entity';

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

  @ManyToOne(() => ProductCategory, (category) => category.product, {
    cascade: true,
  })
  category?: ProductCategory;

  @ManyToMany(() => Discount, (discount) => discount.products)
  discounts?: Discount[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt?: Date;
}
