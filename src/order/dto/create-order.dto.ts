import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// OrderItemDto должен быть ПЕРЕД CreateOrderDto
export class OrderItemDto {
  @ApiProperty({ example: 2, description: 'Quantity of the product' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 19.99, description: 'Price of the product' })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 'productId123', description: 'ID of the product' })
  @IsString()
  productId: string;

  @ApiProperty({ example: 'storeId456', description: 'ID of the store' })
  @IsString()
  storeId: string;
}

export class CreateOrderDto {
  @ApiProperty({
    example: 'COMPLETED',
    description: 'Status of the order',
    required: false,
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiProperty({
    type: [OrderItemDto],
    description: 'List of items in the order',
  })
  @IsArray()
  @ValidateNested({ each: true }) // ValidateNested, не IsArray с each
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
