import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus } from 'src/entities/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  create(createOrderDto: CreateOrderDto, userId: string) {
    const order_items = createOrderDto.items.map((item) => {
      return {
        quantity: item.quantity,
        price: item.price,
        productId: item.productId,
        storeId: item.storeId,
        userId: userId, // Use the column directly, not the relation
      };
    });

    const total = order_items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    const newOrder = {
      status: OrderStatus.PENDING,
      userId: userId,
      orderItems: order_items,
      total: total,
    };

    return this.orderRepository.save(newOrder);
  }

  findAll() {
    return this.orderRepository.find({ relations: ['orderItems'] });
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
