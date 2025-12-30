import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Product } from './product.entity';
import { Store } from './store.entity';
import { Matches } from 'class-validator';

@Unique(['name', 'storeId'])
@Entity('colors')
export class Color {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column()
  name: string;

  @Matches(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/, {
    message: 'value must be a valid hex color code',
  })
  @Column()
  value: string;

  @Column({ name: 'store_id', nullable: true })
  storeId: string;

  @ManyToOne(() => Store, (store) => store.colors, { nullable: true })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @OneToMany(() => Product, (product) => product.color)
  products: Product[];
}
