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
import { Store } from './store.entity';
import { Category } from './category.entity';
import { Color } from './color.entity';
import { Review } from './review.entity';
import { OrderItem } from './order-item.entity';
import { User } from './user.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column('json')
  images: any;

  @Column({ name: 'store_id' })
  storeId: string;

  @ManyToOne(() => Store, (store) => store.products)
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ name: 'category_id', nullable: true })
  categoryId: string;

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ name: 'color_id', nullable: true })
  colorId: string;

  @ManyToOne(() => Color, (color) => color.products, { nullable: true })
  @JoinColumn({ name: 'color_id' })
  color: Color;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @ManyToOne(() => User, (user) => user.favorites, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];
}
