import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { orderResponse, ordersResponse } from './response/order.response';

@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Auth()
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('place')
  @ApiBody({ type: CreateOrderDto })
  @ApiOkResponse(orderResponse)
  create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.orderService.create(createOrderDto, userId);
  }

  @Get()
  @ApiOkResponse(ordersResponse)
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  @ApiNotFoundResponse({ description: 'Order not found' })
  @ApiOkResponse(orderResponse)
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }
}
