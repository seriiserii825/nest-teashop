import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class CreateOrderDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsArray({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

export class OrderItemDto {
  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;

  @IsString()
  productId: string;

  @IsString()
  storeId: string;
}
