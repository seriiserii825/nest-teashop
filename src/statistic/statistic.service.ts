import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjsModule from 'dayjs';
const dayjs = dayjsModule.default;
import { Category } from 'src/entities/category.entity';
import { Order } from 'src/entities/order.entity';
import { Product } from 'src/entities/product.entity';
import { Review } from 'src/entities/review.entity';
import { User } from 'src/entities/user.entity';
import { Between, Repository } from 'typeorm';

dayjs.locale('en');

@Injectable()
export class StatisticService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async getMainStatistics(storeId: string) {
    const totalRevenue = await this.calculateTotalRevenue(storeId);
    const productsCount = await this.countProducts(storeId);
    const categoriesCount = await this.countCategories(storeId);
    const averageRating = await this.calculateAverageRating(storeId);
    const colorsCount = await this.countColors(storeId);
    const reviewsCount = await this.countReviews(storeId);
    return [
      { id: 'revenue', name: 'Total Revenue', value: totalRevenue },
      { id: 'products', name: 'Products Count', value: productsCount },
      { id: 'categories', name: 'Categories Count', value: categoriesCount },
      { id: 'colors', name: 'Colors Count', value: colorsCount },
      { id: 'reviews', name: 'Reviews Count', value: reviewsCount },
      { id: 'rating', name: 'Average Rating', value: averageRating },
    ];
  }

  async countReviews(storeId: string) {
    const reviews_count = await this.reviewRepository.count({
      where: { storeId: storeId },
    });
    return reviews_count;
  }

  async countColors(storeId: string) {
    const colors_count = await this.productRepository
      .createQueryBuilder('product')
      .select('COUNT(DISTINCT product.colorId)', 'count')
      .where('product.storeId = :storeId', { storeId })
      .getRawOne<{ count: string }>();

    return colors_count ? parseInt(colors_count.count, 10) : 0;
  }

  async getMiddleStatistics(storeId: string) {
    // const monthlySales = await this.calculateMonthlySales(storeId);
    const lastUsers = await this.getLastUsers(storeId);
    return { lastUsers };
  }

  private async calculateTotalRevenue(storeId: string) {
    const orders = await this.orderRepository.find({
      relations: ['orderItems'],
      where: {
        orderItems: {
          storeId: storeId,
        },
      },
    });
    const totalRevenue = orders.reduce((acc, order) => {
      const total = order.orderItems.reduce(
        (itemAcc, item) => itemAcc + item.price * item.quantity,
        0,
      );
      return acc + total;
    }, 0);
    return totalRevenue;
  }
  private async countProducts(storeId: string) {
    const products_count = await this.productRepository.count({
      where: { storeId: storeId },
    });
    return products_count;
  }
  private async countCategories(storeId: string) {
    const categories_count = await this.categoryRepository.count({
      where: { storeId: storeId },
    });
    return categories_count;
  }

  private async calculateAverageRating(storeId: string) {
    const result = await this.reviewRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'avg')
      .where({ storeId })
      .getRawOne<{ avg: string | null }>();

    return result?.avg ? parseFloat(result.avg) : null;
  }

  async calculateMonthlySales(storeId: string) {
    const startDate = dayjs().subtract(30, 'days').startOf('day').toDate();
    const endDate = dayjs().endOf('day').toDate();
    const salesRaw = await this.orderRepository.find({
      relations: ['orderItems'],
      where: {
        createdAt: Between(startDate, endDate),
        orderItems: {
          storeId: storeId,
        },
      },
    });
    const formatDate = (date: Date) => dayjs(date).format('YYYY-MM-DD');
    const salesByDate = new Map<string, number>();
    salesRaw.forEach((order) => {
      const dateKey = formatDate(order.createdAt);
      const orderTotal = order.orderItems.reduce(
        (itemAcc, item) => itemAcc + item.price * item.quantity,
        0,
      );
      if (salesByDate.has(dateKey)) {
        salesByDate.set(dateKey, salesByDate.get(dateKey)! + orderTotal);
      } else {
        salesByDate.set(dateKey, orderTotal);
      }
    });
    const monthlySales = Array.from(salesByDate, ([date, total]) => ({
      date,
      total,
    }));
    return monthlySales;
  }
  async getLastUsers(storeId: string) {
    const lastUsers = await this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.orders', 'order')
      .innerJoin('order.orderItems', 'item', 'item.storeId = :storeId', {
        storeId,
      })
      .leftJoinAndSelect('user.orders', 'userOrders')
      .leftJoinAndSelect(
        'userOrders.items',
        'orderItem',
        'orderItem.storeId = :storeId',
        { storeId },
      )
      .orderBy('user.createdAt', 'DESC')
      .take(5)
      .select(['user', 'userOrders', 'orderItem.price'])
      .getMany();

    return lastUsers.map((user) => {
      const lastOrder = user.orders[user.orders.length - 1];
      const total = lastOrder.orderItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        total: total,
      };
    });
  }
}
