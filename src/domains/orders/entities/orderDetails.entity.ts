import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('orderDetails')
export class OrderDetails {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
