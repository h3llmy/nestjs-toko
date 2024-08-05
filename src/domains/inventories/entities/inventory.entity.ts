import { Product } from '@domains/products/entities/product.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Inventories')
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @OneToOne(() => Product, (product) => product.inventory)
  @JoinColumn()
  product?: Product;

  @Column({ default: 0 })
  quantity: number;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt?: Date;
}
