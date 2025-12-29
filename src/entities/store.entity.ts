import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';
import { Category } from './category.entity';
import { Color } from './color.entity';
import { Review } from './review.entity';
import { OrderItem } from './order-item.entity';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.stores)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Product, (product) => product.store)
  products: Product[];

  @OneToMany(() => Category, (category) => category.store)
  categories: Category[];

  @OneToMany(() => Color, (color) => color.store)
  colors: Color[];

  @OneToMany(() => Review, (review) => review.store)
  reviews: Review[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.store)
  orderItems: OrderItem[];
}
