import { Module } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { StatisticController } from './statistic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { Product } from 'src/entities/product.entity';
import { Category } from 'src/entities/category.entity';
import { Review } from 'src/entities/review.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Product, Category, Review, User])],
  controllers: [StatisticController],
  providers: [StatisticService],
})
export class StatisticModule {}
