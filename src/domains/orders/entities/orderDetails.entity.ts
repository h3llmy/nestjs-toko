import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../..//products/entities/product.entity';
import { Discount } from '../../discounts/entities/discount.entity';
import { ProductCategory } from '../../product-category/entities/product-category.entity';

@Entity('orderDetails')
export class OrderDetails {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.orderDetails)
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderDetails)
  product: Product;

  @Column({ nullable: false })
  productName: string;

  @Column({ type: 'text' })
  productDescription: string;

  @Column({ nullable: false })
  productPrice: number;

  @ManyToOne(() => Discount, (discount) => discount.orderDetails)
  discount: Discount;

  @Column()
  discountName: string;

  @Column({ type: 'text' })
  discountDescription: string;

  @Column()
  discountCode: string;

  @Column()
  discountPercentage: number;

  @Column()
  discountStartDate: number;

  @Column()
  discountEndDate: number;

  @ManyToOne(() => ProductCategory, (category) => category.orderDetails)
  category: ProductCategory;

  @Column()
  categoryName: string;

  @Column()
  quantity: number;

  @Column()
  totalPrice: number;
}
