import { ArrayMinSize, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsNotEmpty({ each: true })
  images: string[];

  @IsString()
  @IsNotEmpty()
  storeId: string;

  @IsString()
  @IsNotEmpty()
  categoryId?: string;

  @IsString()
  @IsNotEmpty()
  colorId?: string;
}
