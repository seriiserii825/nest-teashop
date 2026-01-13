import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ example: 'Great product, highly recommend!' })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  rating: number;

  @ApiProperty({ example: 'productId123' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 'userId456' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
