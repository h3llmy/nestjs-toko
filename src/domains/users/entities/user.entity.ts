import { Role } from '../../roles/entities/role.entity';
import { Order } from '../../orders/entities/order.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SocialAuthType } from '../../auth/social-auth.enum';

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Index({ unique: true })
  @Column({ unique: true })
  email: string;

  @Column({ select: false, nullable: true })
  password?: string;

  @Column({ type: 'bigint' })
  emailVerifiedAt: number;

  @Column({ nullable: true })
  socialId?: string;

  @Column({ type: 'enum', nullable: true, enum: SocialAuthType })
  socialType?: SocialAuthType;

  @ManyToOne(() => Role, (role) => role.users)
  role?: Role;

  @OneToMany(() => Order, (order) => order.user)
  order?: Order;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt?: Date;
}
