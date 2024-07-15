import { Product } from '../../products/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('discounts')
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
  products: Product[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
