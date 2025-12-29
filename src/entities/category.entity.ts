import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { Store } from './store.entity';

@Entity('categories')
export class Category {
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

  @Column({ name: 'store_id', nullable: true })
  storeId: string;

  @ManyToOne(() => Store, (store) => store.categories, { nullable: true })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
