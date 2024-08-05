import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '@domains/products/entities/product.entity';
import { Discount } from '@domains/discounts/entities/discount.entity';
import { ProductCategory } from '@domains/product-category/entities/product-category.entity';

@Entity('orderDetails')
export class OrderDetails {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.orderDetails)
  order?: Order;

  @ManyToOne(() => Product, (product) => product.orderDetails)
  product: Product;

  @Column()
  productName: string;

  @Column({ type: 'text' })
  productDescription: string;

  @Column()
  productPrice: number;

  @ManyToOne(() => Discount, (discount) => discount.orderDetails, {
    nullable: true,
  })
  discount?: Discount;

  @Column({ nullable: true })
  discountName?: string;

  @Column({ type: 'text', nullable: true })
  discountDescription?: string;

  @Column({ nullable: true })
  discountCode?: string;

  @Column({ nullable: true })
  discountPercentage?: number;

  @Column({ nullable: true })
  discountStartDate?: number;

  @Column({ nullable: true })
  discountEndDate?: number;

  @ManyToOne(() => ProductCategory, (category) => category.orderDetails)
  category: ProductCategory;

  @Column()
  categoryName: string;

  @Column()
  quantity: number;

  @Column()
  totalPrice: number;
}
